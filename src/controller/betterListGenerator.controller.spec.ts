import { describe, it, expect, vi, Mock } from 'vitest';
import request from 'supertest';
import BetterListGeneratorController from './betterListGenerator.controller';
import { IBetterListGeneratorService } from '../utils/interfaces/service/betterListGenerator.service.interface';
import App from '../app';

const mockService: IBetterListGeneratorService = {
	processList: vi.fn() as Mock,
	loadPatients: vi.fn(),
	selectPatients: vi.fn(),
	selectPatientsDebug: vi.fn(),
};

describe('BetterListGeneratorController', () => {
	const controller = new BetterListGeneratorController(mockService);
	const app = new App([controller]).app;
	app.use(controller.router);

	it('should return a list of patients on /api/v1/list-generator', async () => {
		const response = await request(app).get('/api/v1/list-generator').query({ latitude: '40.7128', longitude: '-74.0060' });
		expect(response.status).toBe(200);
	});

	it('should return 500 if an error occurs during processing', async () => {
		// force the service to throw an error
		(mockService.processList as Mock).mockImplementation(() => {
			throw new Error('Simulated service error');
		});

		const response = await request(app).get('/api/v1/list-generator').query({ latitude: '40.7128', longitude: '-74.0060' });

		expect(response.status).toBe(500);
		expect(response.text).toBe('Simulated service error');
	});

	it('should handle non-Error instances and return them as a string', async () => {
		(mockService.processList as Mock).mockImplementation(() => {
			throw 'Simulated non-Error exception';
		});

		const response = await request(app).get('/api/v1/list-generator').query({ latitude: '40.7128', longitude: '-74.0060' });

		expect(response.status).toBe(500);
		expect(response.text).toBe('Simulated non-Error exception');
	});

	it('should return a 400 if validation fails on /api/v1/list-generator', async () => {
		const response = await request(app).get('/api/v1/list-generator').query({ latitude: 'invalid', longitude: 'invalid' });

		expect(response.status).toBe(400);
	});

	it('should return a list of patients on /api/v1/list-generator', async () => {
		const response = await request(app).get('/api/v1/list-generator/debug').query({ latitude: '40.7128', longitude: '-74.0060' });
		expect(response.status).toBe(200);
	});

	it('should return 500 if an error occurs during processing debug route', async () => {
		// force the service to throw an error
		(mockService.processList as Mock).mockImplementation(() => {
			throw new Error('Simulated service error');
		});

		const response = await request(app).get('/api/v1/list-generator/debug').query({ latitude: '40.7128', longitude: '-74.0060' });

		expect(response.status).toBe(500);
		expect(response.text).toBe('Simulated service error');
	});

	it('should handle non-Error instances and return them as a string debug route', async () => {
		(mockService.processList as Mock).mockImplementation(() => {
			throw 'Simulated non-Error exception';
		});

		const response = await request(app).get('/api/v1/list-generator/debug').query({ latitude: '40.7128', longitude: '-74.0060' });

		expect(response.status).toBe(500);
		expect(response.text).toBe('Simulated non-Error exception');
	});

	it('should return a 400 if validation fails on /api/v1/list-generator/debug', async () => {
		const response = await request(app).get('/api/v1/list-generator/debug').query({ latitude: 'invalid', longitude: 'invalid' });

		expect(response.status).toBe(400);
	});
});
