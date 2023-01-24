using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

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
            Console.CancelKeyPress += InterruptHandler;

            if (Directory.Exists(repoDirectory))
            {
                Directory.Delete(repoDirectory, true);
            }
            await Git.Clone(repoUrl, repoDirectory, repoBranch);

            string lastCommitHash = "";
            // TODO: унести логи из stdout

            while (true)
            {
                await Git.FetchAndResetHard(repoDirectory, repoBranch);

                var (currentCommitHash, currentCommitMessage) = await Git.GetLastCommitInfo(repoDirectory);
                if (currentCommitHash != lastCommitHash)
                {
                    lastCommitHash = currentCommitHash;

                    Console.WriteLine("Got new HEAD commit info:");
                    Console.WriteLine(currentCommitHash);
                    Console.WriteLine(currentCommitMessage);

                    if (currentCommitMessage.StartsWith("#restart"))
                    {
                        try {
                            executer.InterruptCurrentExecution();
                        }
                        catch (OperationCanceledException)
                        {
                        }

                        executer = new WorkerExecuter(repoDirectory);
                        
                        var extraArgs = "";
                        if (currentCommitMessage.Contains(' '))
                        {
                            extraArgs = currentCommitMessage.Split(' ', 2)[1];
                        }
                        
                        Console.WriteLine($"Restarting with args {extraArgs}");
                        executer.Execute(extraArgs);
                    }
                }
                
                Thread.Sleep(repoUpdateInterval);
            }
        }

        private static void InterruptHandler(object? sender, ConsoleCancelEventArgs args)
        {
            Console.WriteLine("\nStopping agent...");
            executer.InterruptCurrentExecution();
        }

        private static WorkerExecuter executer = new();
    }
}