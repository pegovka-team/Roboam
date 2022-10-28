using System;
using System.Threading;
using System.Threading.Tasks;

namespace agent
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            if (args.Length != 2)
            {
                Console.WriteLine("Usage: agent <repoDirectory> <repoUrl>");
                return;
            }
            var repoUrl = args[0];
            var repoDirectory = args[1];
            
            // TODO: сносить директорию перед клонированием, если уже что-то есть, или просто не клонировать
            await Git.Clone(repoUrl, repoDirectory);

            var lastCommitInfo = await Git.GetLastCommitInfo(repoDirectory);
            var currentCommitHash = lastCommitInfo.Item1;
            var currentCommitMessage = lastCommitInfo.Item2;
            
            // TODO: унести логи из stdout
            Console.WriteLine("Successfully cloned repo with following HEAD commit info:");
            Console.WriteLine(currentCommitHash);
            Console.WriteLine(currentCommitMessage);

            if (currentCommitMessage.StartsWith("#restart"))
            {
                // TODO: реализовать перезапуск воркера с командой из конфига и параметрами из сообщения коммита
                Console.WriteLine("Detected restart command in commit message, restarting...");
            }
            
            while (true)
            {
                await Git.Pull(repoDirectory); // TODO: заменить на более надёжную комбинацию Fetch+Reset

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
                        Console.WriteLine("Detected restart command in commit message, restarting...");
                    }
                }
                
                Thread.Sleep(5000);
            }
        }
    }
}