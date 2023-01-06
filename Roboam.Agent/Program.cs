using System;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using CliWrap;

namespace agent
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            if (args.Length != 3)
            {
                Console.WriteLine("Usage: agent <repoUrl> <repoDirectory> <repoBranch> [repoUpdateInterval]");
                return;
            }
            var repoUrl = args[0];
            var repoDirectory = args[1];
            var repoBranch = args[2];
            var repoUpdateInterval = args.Length > 3 ? int.Parse(args[3]) : 5000;
            
            if (Directory.Exists(repoDirectory))
            {
                Directory.Delete(repoDirectory, true);
            }
            await Git.Clone(repoUrl, repoDirectory, repoBranch);

            var lastCommitInfo = await Git.GetLastCommitInfo(repoDirectory);
            var currentCommitHash = lastCommitInfo.Item1;
            var currentCommitMessage = lastCommitInfo.Item2;
            
            // TODO: унести логи из stdout
            Console.WriteLine("Successfully cloned repo with following HEAD commit info:");
            Console.WriteLine(currentCommitHash);
            Console.WriteLine(currentCommitMessage);

            Process worker = new Process();

            if (currentCommitMessage.StartsWith("#restart"))
            {
                var commandsReadStream = File.OpenRead(Path.Join(repoDirectory, "run_params.json"));
                var commands = await JsonSerializer.DeserializeAsync<RunWorkerCommands>(commandsReadStream);
                if (commands is null)
                {
                    throw new Exception("Could not load run_params.json from repository root");
                }

                if (commands.BuildCommand is not null)
                {
                    await Cli.Wrap(commands.BuildCommand)
                        .WithArguments(commands.BuildArgs)
                        .ExecuteAsync();
                }

                var argsFromLastCommit = currentCommitMessage.Split(' ', 2)[1];
                var workerExec = Cli.Wrap(commands.ExecuteProcessCommand)
                    .WithArguments(new[] {commands.ExecuteProcessArgs, argsFromLastCommit}).ExecuteAsync();
                worker = Process.GetProcessById(workerExec.ProcessId);

                Console.WriteLine($"Restarting with args {argsFromLastCommit}");
            }
            
            while (true)
            {
                await Git.FetchAndResetHard(repoDirectory, repoBranch);

                lastCommitInfo = await Git.GetLastCommitInfo(repoDirectory);
                if (lastCommitInfo.Item1 != currentCommitHash)
                {
                    currentCommitHash = lastCommitInfo.Item1;
                    currentCommitMessage = lastCommitInfo.Item2;
                    Console.WriteLine("Detected changes in repo, new HEAD commit info:");
                    Console.WriteLine(currentCommitHash);
                    Console.WriteLine(currentCommitMessage);

                    if (currentCommitMessage.StartsWith("#restart"))
                    {
                        try
                        {
                            worker.Kill();
                        } catch (InvalidOperationException) {}

                        var commandsReadStream = File.OpenRead(Path.Join(repoDirectory, "run_params.json"));
                        var commands = await JsonSerializer.DeserializeAsync<RunWorkerCommands>(commandsReadStream);
                        if (commands is null)
                        {
                            throw new Exception("Could not load run_params.json from repository root");
                        }
                        
                        if (commands.BuildCommand is not null)
                        {
                            await Cli.Wrap(commands.BuildCommand)
                                .WithArguments(commands.BuildArgs)
                                .WithWorkingDirectory(repoDirectory)
                                .ExecuteAsync();
                        }
                        
                        var argsFromLastCommit = currentCommitMessage.Split(' ', 2)[1];
                        var workerExec = Cli.Wrap(commands.ExecuteProcessCommand)
                            .WithArguments(new[] {commands.ExecuteProcessArgs, argsFromLastCommit}).ExecuteAsync();
                        worker = Process.GetProcessById(workerExec.ProcessId);

                        Console.WriteLine($"Restarting with args {argsFromLastCommit}");
                    }
                }
                
                // TODO: передавать интервал в аргументах запуска агента
                Thread.Sleep(repoUpdateInterval);
            }
        }
    }
}