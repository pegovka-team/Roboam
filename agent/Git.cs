using System.Collections.Generic;
using System.Threading.Tasks;
using CliWrap;
using CliWrap.Buffered;

namespace agent
{
    public static class Git
    {
        public static async Task<BufferedCommandResult> Clone(string repoUrl, string repoDirectory)
        {
            var gitExecuteResult = await Cli.Wrap("git")
                .WithArguments($"clone {repoUrl} {repoDirectory}")
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .ExecuteBufferedAsync();

            return gitExecuteResult;
        }
        
        public static async Task<(string, string)> GetLastCommitInfo(string repoDirectory)
        {
            var gitExecuteResult = await Cli.Wrap("git")
                .WithWorkingDirectory(repoDirectory)
                .WithArguments(new[]{"log", "-1", "--pretty=%H %B"})
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .ExecuteBufferedAsync();
            
            var resultSplit = gitExecuteResult.StandardOutput.Split(new[] {' '}, 2);
            var currentCommitHash = resultSplit[0];
            var currentCommitMessage = resultSplit[1];
            
            return (currentCommitHash, currentCommitMessage);
        }
        
        public static async Task<BufferedCommandResult> Pull(string repoDirectory)
        {
            var gitExecuteResult = await Cli.Wrap("git")
                .WithWorkingDirectory(repoDirectory)
                .WithArguments(new[]{"pull"})
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .ExecuteBufferedAsync();

            return gitExecuteResult;
        }
    }
}