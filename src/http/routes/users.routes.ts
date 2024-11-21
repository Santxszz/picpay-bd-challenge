import express from "express";
import { celebrate, Joi, Segments } from "celebrate";

import UserController from "../controllers/users/users.controller";
import checkUserAuth from "../middlewares/CheckUserAuth";

const authRoutes = express.Router();

const userController = new UserController();

authRoutes.post(
	"/register",
	celebrate({
		[Segments.BODY]: {
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			document: Joi.string().required(),
			password: Joi.string().required(),
		},
	}),
	userController.register,
);

authRoutes.post(
	"/login",
	celebrate({
		[Segments.BODY]: {
			document: Joi.string().required(),
			password: Joi.string().required(),
		},
	}),
	userController.login,
);

authRoutes.post(
	"/user/:userId/keys/create",
	celebrate({
		[Segments.BODY]: {
			keyTransfer: Joi.string().required(),
		},
		[Segments.PARAMS]: {
			userId: Joi.string().required(),
		},
	}),
	checkUserAuth,
	userController.keyCreate,
);

authRoutes.post(
	"/user/:userId/deposit",
	celebrate({
		[Segments.BODY]: {
			ammount: Joi.number().required(),
		},
		[Segments.PARAMS]: {
			userId: Joi.string().required(),
		},
	}),
	checkUserAuth,
	userController.deposit,
);

export default authRoutes;
