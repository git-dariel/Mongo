import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { Cloudinary } from "../helpers/cloudinary";
import { upload } from "../middleware/multer";
import { route } from "express-extract-routes";
import { AppError } from "../middleware/errorHandler";
import { UseMiddleware } from "../middleware/useMiddleware";
import { QueryBuilder, QueryOptions } from "../helpers/queryBuilder";

// Purpose: This controller class is responsible for handling the user related requests.
@route("/user")
export class UserController {
  private userService: UserService;
  private cloudinary: Cloudinary;

  constructor() {
    this.userService = new UserService();
    this.cloudinary = new Cloudinary();
  }

  /**
   * @swagger
   * /user/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The user ID
   *     responses:
   *       200:
   *         description: The user data
   *       404:
   *         description: User not found
   */
  @route.get("/:id")
  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryOptions: QueryOptions = {
        fields: req.query.fields as string,
        populate: req.query.populate as string,
      };
      const parsedOptions = QueryBuilder.parse(queryOptions);
      const user = await this.userService.getUser(req.params.id, parsedOptions);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/:
   *   get:
   *     summary: Get the users
   *     tags: [User]
   *     responses:
   *       200:
   *         description: The user data
   *       404:
   *         description: User not found
   */
  @route.get("/")
  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryOptions: QueryOptions = {
        fields: req.query.fields as string,
        limit: req.query.limit as unknown as number,
        sort: req.query.sort as string,
        order: req.query.order as "asc" | "desc",
        filter: req.query.filter as string,
        populate: req.query.populate as string,
      };
      const parsedOptions = QueryBuilder.parse(queryOptions);
      const users = await this.userService.getUsers(parsedOptions);
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/:
   *   post:
   *     summary: Create a new user
   *     tags: [User]
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *              email:
   *                type: string
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         description: User created successfully
   *       404:
   *         description: User not found
   */
  @route.post("/")
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/:
   *   put:
   *     summary: Update a user
   *     tags: [User]
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              username:
   *                type: string
   *              email:
   *                type: string
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         description: User updated successfully
   *       404:
   *         description: User not found
   */
  @route.put("/")
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.updateUser(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The delete user
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       404:
   *         description: User not found
   */
  @route.delete("/")
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.userService.deleteUser(req.params.id);
      res.send("User deleted successfully");
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/search:
   *   post:
   *     summary: Search for a user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               query:
   *                 type: string
   *                 description: The search query
   *     responses:
   *       200:
   *         description: The user data
   *       404:
   *         description: User not found
   */
  @route.post("/search")
  search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.searchUser(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/upload-image/{id}:
   *   post:
   *     summary: Upload user profile image
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   */
  @route.post("/upload-image/:id")
  @UseMiddleware(upload.single("image"))
  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new AppError("Please upload an image", 400);

      const imageUrl = await this.cloudinary.uploadImage(req.file);
      res.json(await this.userService.updateUser({ _id: req.params.id, avatar: imageUrl }));
    } catch (error) {
      next(error);
    }
  }
}
