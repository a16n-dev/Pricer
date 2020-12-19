export interface ILoggerService {
    log: (message: string) => void;
}

const log = (message: string) => {
  console.log(message);
};

export const LoggerService : ILoggerService = {
  log,
};
