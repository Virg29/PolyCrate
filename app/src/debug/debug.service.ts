import { Injectable } from '@nestjs/common';
import v8 from 'node:v8';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { ReadStream } from 'node:fs';

@Injectable()
export class DebugService {
	constructor() {}

	heapdump(): ReadStream {
		const dumpsDir = path.join(process.cwd(), '/heapdumps/');

		if (!fs.existsSync(dumpsDir)) {
			fs.mkdirSync(dumpsDir);
		}

		const dumpPath = path.join(
			dumpsDir,
			`${new Date().getTime()}.heapsnapshot`,
		);
		v8.writeHeapSnapshot(dumpPath);

		return fs.createReadStream(dumpPath);
	}
}
