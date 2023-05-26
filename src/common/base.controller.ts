import { Response, Router } from 'express';
import { IControllerRoute, TReturnExpress } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	private _nameController = 'Controller';

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	protected setNameController(name: string): void {
		this._nameController = name;
	}

	public send<T>(res: Response, code: number, message: T): TReturnExpress {
		res.type('application/json');
		return res.status(200).json(message);
	}

	public ok<T>(res: Response, message: T): TReturnExpress {
		return this.send<T>(res, 200, message);
	}

	public created<T>(res: Response, message: T): TReturnExpress {
		return this.send<T>(res, 201, message);
	}

	protected bindRoutes(routes: IControllerRoute[]): void {
		for (const route of routes) {
			this.logger.log(`[${this._nameController}] ${route.method.toUpperCase()} ${route.path}`);
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.func.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
