export interface RuntimeInjectorInterface {
  call(constructorName: string, name: string): boolean;
}

export interface RuntimeInjectorModuleOptions {
  services: (() => any)[];
  logLevel?: 'debug' | 'info' | 'warn' | 'error' | 'log';
}
