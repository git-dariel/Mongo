export function UseMiddleware(middleware: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [req, res, next] = args;
      return new Promise((resolve, reject) => {
        middleware(req, res, (err: any) => {
          if (err) {
            next(err);
            reject(err);
            return;
          }
          resolve(originalMethod.apply(this, args));
        });
      });
    };

    return descriptor;
  };
}
