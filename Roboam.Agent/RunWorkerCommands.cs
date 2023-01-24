using System;
using System.Linq;

namespace agent
{
    public class RunWorkerCommands
    {
        public RunWorkerCommands(string[] commands)
        {
            Commands = commands
                .Where(command => command.Length > 0)
                .Select(command => new RunWorkerCommand(command)).ToArray();
        }

        public RunWorkerCommands()
        {
            Commands = Array.Empty<RunWorkerCommand>();
        }

        public RunWorkerCommand[] Commands;
    }

    public class RunWorkerCommand
    {
        public RunWorkerCommand(string command)
        {
            if (command.StartsWith("@")) // TODO: заменить разметку для вставки коммитных аргументов на $1, $2, $*, ...
            {
                WithArgsFromCommit = true;
                command = command[1..];
            }
            else
            {
                WithArgsFromCommit = false;
            }

            var executableAndArgs = command.Split(' ', 2);
            Executable = executableAndArgs[0];
            Args = executableAndArgs.Length > 1 ? executableAndArgs[1] : "";
        }

        public string Executable;
        public string Args;
        public bool WithArgsFromCommit;
    }
}
