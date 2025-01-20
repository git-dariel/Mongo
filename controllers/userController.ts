import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { CloudinaryService } from "../services/cloudinaryService";
import { upload } from "../middleware/multer";
import { route } from "express-extract-routes";
import { AppError } from "../middleware/errorHandler";
import { UseMiddleware } from "../middleware/useMiddleware";

// Purpose: This controller class is responsible for handling the user related requests.
@route("/user")
export class UserController {
  private userService: UserService;
  private cloudinaryService: CloudinaryService;

  constructor() {
    this.userService = new UserService();
    this.cloudinaryService = new CloudinaryService();
  }

  /**
   * @swagger
   * /user/get/{id}:
   *   get:
   *     summary: Get a user by ID
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
  @route.get("/get/:id")
  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/get/all:
   *   get:
   *     summary: Get the users
   *     responses:
   *       200:
   *         description: The user data
   *       404:
   *         description: User not found
   */
  @route.get("/get/all")
  getUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.getUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @swagger
   * /user/create:
   *   post:
   *     summary: Create a new user
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
  @route.post("/create")
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
   * /user/update:
   *   put:
   *     summary: Update a user
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
  @route.put("/update")
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
   * /user/delete/{id}:
   *   delete:
   *     summary: Delete a user by ID
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
  @route.delete("/delete")
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
      if (!req.file) {
        throw new AppError("Please upload an image", 400);
      }

      const imageUrl = await this.cloudinaryService.uploadImage(req.file);
      const updateData = {
        _id: req.params.id,
        avatar: imageUrl,
      };

      const user = await this.userService.updateUser(updateData);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}
