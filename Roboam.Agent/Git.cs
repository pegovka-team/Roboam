using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using CliWrap;
using CliWrap.Buffered;

namespace agent
{
    public static class Git
    {
        public static async Task<BufferedCommandResult> Clone(string repoUrl, string repoDirectory, string repoBranch)
        {
            var gitCloneExecutionResult = await Cli.Wrap("git")
                .WithArguments($"clone {repoUrl} {repoDirectory} --branch {repoBranch}")
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .WithValidation(CommandResultValidation.None)
                .ExecuteBufferedAsync();

            if (gitCloneExecutionResult.ExitCode != 0 && gitCloneExecutionResult.ExitCode != 130)
            {
                throw new ArgumentException(
                    $"Failed to clone {repoBranch} branch from {repoUrl}:\n" +
                    $"{gitCloneExecutionResult.StandardError}");
            }
            return gitCloneExecutionResult;
        }
        
        public static async Task<(string, string)> GetLastCommitInfo(string repoDirectory)
        {
            var gitLogExecutionResult = await Cli.Wrap("git")
                .WithWorkingDirectory(repoDirectory)
                .WithArguments(new[]{"log", "-1", "--pretty=%H %B"})
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .WithValidation(CommandResultValidation.None)
                .ExecuteBufferedAsync();
            
            if (gitLogExecutionResult.ExitCode != 0 && gitLogExecutionResult.ExitCode != 130)
            {
                throw new ArgumentException(
                    $"Failed to get last commit info in {repoDirectory} directory:\n" +
                    $"{gitLogExecutionResult.StandardError}");
            }

            var resultSplit = gitLogExecutionResult.StandardOutput.Split(new[] {' '}, 2);
            var currentCommitHash = resultSplit[0];
            var currentCommitMessage = resultSplit[1];
            
            return (currentCommitHash, currentCommitMessage);
        }

        public static async Task<BufferedCommandResult> FetchAndResetHard(string repoDirectory, string repoBranch)
        {
            var gitFetchExecutionResult = await Cli.Wrap("git")
                .WithWorkingDirectory(repoDirectory)
                .WithArguments(new[]{"fetch"})
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .WithValidation(CommandResultValidation.None)
                .ExecuteBufferedAsync();

            if (gitFetchExecutionResult.ExitCode != 0 && gitFetchExecutionResult.ExitCode != 130)
            {
                throw new ArgumentException(
                    $"Failed to fetch {repoBranch} branch in {repoDirectory} directory:\n" +
                    $"{gitFetchExecutionResult.StandardError}");
            }

            var gitResetExecutionResult = await Cli.Wrap("git")
                .WithWorkingDirectory(repoDirectory)
                .WithArguments(new[]{"reset", $"origin/{repoBranch}", "--hard"})
                .WithEnvironmentVariables(new Dictionary<string, string?>
                {
                    {"GIT_SSH_COMMAND", "ssh -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no"}
                })
                .WithValidation(CommandResultValidation.None)
                .ExecuteBufferedAsync();

            if (gitFetchExecutionResult.ExitCode != 0 && gitFetchExecutionResult.ExitCode != 130)
            {
                throw new ArgumentException(
                    $"Failed to reset {repoBranch} branch in {repoDirectory} directory:\n" +
                    $"{gitResetExecutionResult.StandardError}");
            }

            return gitFetchExecutionResult;
        }
    }
}
