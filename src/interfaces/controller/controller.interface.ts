import { Router } from 'express';

//! all controllers have to implement IController interface, whatever the archive, also a Router

export interface IController {
	router: Router;
}
