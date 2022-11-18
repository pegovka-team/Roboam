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
            if (args.Length != 2)
            {
                Console.WriteLine("Usage: agent <repoUrl> <repoDirectory>");
                return;
            }
            var repoUrl = args[0];
            var repoDirectory = args[1];
            
            if (Directory.Exists(repoDirectory))
            {
                Directory.Delete(repoDirectory, true);
            }
            await Git.Clone(repoUrl, repoDirectory);

            var lastCommitInfo = await Git.GetLastCommitInfo(repoDirectory);
            var currentCommitHash = lastCommitInfo.Item1;
            var currentCommitMessage = lastCommitInfo.Item2;
            
            // TODO: унести логи из stdout
            Console.WriteLine("Successfully cloned repo with following HEAD commit info:");
            Console.WriteLine(currentCommitHash);
            Console.WriteLine(currentCommitMessage);

            var proc = new Process();

            if (currentCommitMessage.StartsWith("#restart"))
            {
                var runParamsReadStream = File.OpenRead(Path.Join(repoDirectory, "run_params.json"));
                var runParams = await JsonSerializer.DeserializeAsync<RunParams>(runParamsReadStream);
                if (runParams is null)
                {
                    throw new Exception("Could not load run_params.json from repository root");
                }
                
                if (runParams.BuildCommand is not null)
                {
                    await Cli.Wrap(runParams.BuildCommand)
                        .WithArguments(runParams.BuildArgs)
                        .ExecuteAsync();
                }
                
                var argsFromLastCommit = currentCommitMessage.Split(' ', 2)[1];
                proc.StartInfo.FileName = runParams.ExecuteProcessCommand;
                proc.StartInfo.Arguments = $"{runParams.ExecuteProcessArgs} {argsFromLastCommit}";
                proc.StartInfo.UseShellExecute = true;
                proc.StartInfo.WorkingDirectory = repoDirectory;
                proc.Start();

                Console.WriteLine($"Restarting with args {argsFromLastCommit}");
            }
            
            while (true)
            {
                await Git.FetchAndResetHard(repoDirectory);

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
                            proc.Kill();
                        } catch (InvalidOperationException) {}

                        var runParamsReadStream = File.OpenRead(Path.Join(repoDirectory, "run_params.json"));
                        var runParams = await JsonSerializer.DeserializeAsync<RunParams>(runParamsReadStream);
                        if (runParams is null)
                        {
                            throw new Exception("Could not load run_params.json from repository root");
                        }
                        
                        if (runParams.BuildCommand is not null)
                        {
                            await Cli.Wrap(runParams.BuildCommand)
                                .WithArguments(runParams.BuildArgs)
                                .WithWorkingDirectory(repoDirectory)
                                .ExecuteAsync();
                        }
                        
                        var argsFromLastCommit = currentCommitMessage.Split(' ', 2)[1];
                        proc.StartInfo.FileName = runParams.ExecuteProcessCommand;
                        proc.StartInfo.Arguments = $"{runParams.ExecuteProcessArgs} {argsFromLastCommit}";
                        proc.StartInfo.UseShellExecute = true;
                        proc.StartInfo.WorkingDirectory = repoDirectory;
                        proc.Start();

                        Console.WriteLine($"Restarting with args {argsFromLastCommit}");
                    }
                }
                
                Thread.Sleep(5000);
            }
        }
    }
}