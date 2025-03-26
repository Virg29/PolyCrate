import {
	Inject,
	Injectable,
	Logger,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { IHealthCheckable } from 'src/common/types/interfaces/ihealthcheckable.interface';
@Injectable()
export class HealthcheckService implements OnApplicationBootstrap {
	private readonly logger = new Logger(HealthcheckService.name);
	private readonly healthChecableProviders: IHealthCheckable[] = [];
	constructor(
		@Inject(DiscoveryService) private discoveryService: DiscoveryService,
	) {}

	onApplicationBootstrap() {
		this.discoveryService.getProviders().filter(
			(
				provider: InstanceWrapper<any> & {
					instance: any & { isHealthy?: () => Promise<boolean> };
				},
			) => {
				if (typeof provider?.instance?.isHealthy == 'function')
					this.healthChecableProviders.push(
						provider.instance as IHealthCheckable,
					);
			},
		);
		this.logger.log(
			`Healthcheckable entities: ${JSON.stringify(
				this.healthChecableProviders.map(
					(value) => value.constructor.name,
				),
			)}`,
		);
	}

	async checkHealth(): Promise<boolean> {
		const results = await Promise.allSettled(
			this.healthChecableProviders.map((provider) =>
				provider.isHealthy(),
			),
		);
		this.logger.log('Healthcheck results:');
		results.forEach((result, index) => {
			this.logger.log(
				`${this.healthChecableProviders[index].constructor.name} : ${
					result.status == 'rejected'
						? 'Rejected'
						: result.status == 'fulfilled'
						? result.value
							? 'OK'
							: 'Not healthy'
						: 'Not healthy'
				}`,
			);
		});

		const affirmation =
			results.find(
				(result: PromiseSettledResult<boolean>) =>
					result.status == 'rejected' ||
					(result.status == 'fulfilled' && !result.value),
			) == null;

		this.logger.log(
			`Healthcheck affirmation : ${affirmation ? 'OK' : 'Not healthy'}`,
		);

		return affirmation;
	}
}
