import type { Request, Response } from "express";
import CreateLoginService from "../../services/user/create-user-service";
import AuthUserService from "../../services/auth/auth-user-service";
import CreateKeyTransferService from "../../services/user/create-key-transfer-service";
import DepositBalanceService from "../../services/user/deposit-balance-service";
import TransferService from "../../services/user/user-transfer-service";
import ShowUserService from "../../services/user/show-user-service";

export default class UserController {
	public async register(req: Request, res: Response): Promise<Response> {
		const { name, email, document, password } = req.body;
		const createLoginService = new CreateLoginService();

		const userCreated = await createLoginService.execute({
			name,
			email,
			document,
			password,
		});

		return res.status(200).json(userCreated);
	}

	public async login(req: Request, res: Response): Promise<Response> {
		const { document, password } = req.body;
		const authUserService = new AuthUserService();
		const userAuth = await authUserService.execute({ document, password });

		return res.status(200).json(userAuth);
	}

	public async keyCreate(req: Request, res: Response): Promise<Response> {
		const { keyTransfer } = req.body;
		const { userId } = req.params;
		const createKeyService = new CreateKeyTransferService();
		const createKey = await createKeyService.execute({ keyTransfer, userId });

		return res.status(200).json(createKey);
	}

	public async deposit(req: Request, res: Response): Promise<Response> {
		const { userId } = req.params;
		const ammount = Number(req.body.ammount);

		const depositService = new DepositBalanceService();
		const depositedAmmount = await depositService.execute({
			userId,
			ammount,
		});

		return res.status(200).json(depositedAmmount);
	}

	public async transfer(req: Request, res: Response): Promise<Response> {
		const { userId } = req.params;
		const ammount = Number(req.body.ammount);
		const keyTransfer = req.body.keyTransfer;

		const transferService = new TransferService();
		const transferedAmmount = await transferService.execute({
			userId,
			keyTransfer,
			ammount,
		});

		return res.status(200).json(transferedAmmount);
	}

	public async info(req: Request, res: Response): Promise<Response> {
		const { userId } = req.params;
		const showUserService = new ShowUserService();
		const userInfo = await showUserService.execute({ userId });

		return res.status(200).json(userInfo);
	}
}
