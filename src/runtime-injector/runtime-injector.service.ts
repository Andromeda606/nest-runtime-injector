import { Injectable } from '@nestjs/common';

type ClassType<T> = new (...args: any[]) => T;

@Injectable()
export class RuntimeInjectorService {
  serviceList: {
    [key: string]: any;
  };

  get<T>(key: () => ClassType<T>): T {
    if (!this.serviceList) {
      throw new Error('Service list empty, please add services');
    }
    const fondService = Object.entries(this.serviceList).find(
      ([name, service]) => service?.call?.(key().name, name),
    );
    if (fondService) {
      return fondService[1] as T;
    }
    const baseService = this.serviceList[key.toString()];
    if (!baseService) {
      throw new Error('Service not found');
    }
    return baseService as T;
  }
}
