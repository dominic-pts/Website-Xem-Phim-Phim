const UserSchema = require("../models/UserModel");
const { userValidation } = require("../validation");

class UserController {
	// [GET] /users
	async getAll(req, res, next) {
		try {
			// Lấy danh sách tài khoản người dùng
			const usersFound = await UserSchema.find({})
				.sortable(req)
				.searchable(req)
				.limitable(req);

			// Lấy tổng danh sách thể loại phim
			const allUsersFound = await UserSchema.find({}).searchable(req);

			if (usersFound) {
				res.json({
					code: 1,
					data: usersFound,
					totalLength: allUsersFound.length,
					message: "Lấy danh sách người dùng thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Lấy danh sách người dùng thất bại",
				});
			}
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [GET] /users/:id
	async findById(req, res, next) {
		try {
			// Lấy id từ params
			const userId = req.params.id;

			// Tìm tài khoản người dùng theo id
			const userFound = await UserSchema.findOne({
				_id: userId,
			});

			if (userFound) {
				res.json({
					code: 1,
					data: { ...userFound._doc, password: null },
					message: "Đã tìm thấy tài khoản người dùng",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy tài khoản người dùng",
				});
			}
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [POST] /users/register
	async register(req, res, next) {
		try {
			// Lấy dữ liệu payload từ body của request
			const payload = { ...req.body };

			// Xác thực dữ liệu payload
			const { error } = userValidation.register(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			// Kiểm tra tài khoản người dùng đã tồn tại chưa
			const userExist = await UserSchema.findOne({
				email: payload.email,
			});
			if (userExist) {
				res.json({
					code: 3,
					message: "Email đã tồn tại",
				});
				return;
			}

			// create method in Schema not allowed handle prev middleware in mongoose
			const newUser = new UserSchema(payload);
			const saveUserResult = await newUser.save();

			res.json({
				code: 1,
				data: { ...saveUserResult._doc, password: null },
				message: "Tạo tài khoản người dùng thành công",
			});
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [POST] /users/login
	async login(req, res, next) {
		try {
			// Lấy dữ liệu payload từ body của request
			const payload = { ...req.body };

			// Xác thực dữ liệu payload
			const { error } = userValidation.login(payload);
			if (error) {
				res.json({
					code: 2,
					message: error.message,
				});
				return;
			}

			// Kiểm tra tài khoản người dùng đã tồn tại chưa
			const userExist = await UserSchema.findOne({
				email: payload.email,
			});
			if (!userExist) {
				res.json({
					code: 3,
					message: `Không tìm thấy tài khoản có email: ${payload.email}`,
				});
				return;
			}

			// Kiểm tra mật khẩu
			const isMatchPassword = await userExist.isMatchPassword(
				payload.password
			);
			if (!isMatchPassword) {
				res.json({
					code: 4,
					message: `Sai mật khẩu`,
				});
				return;
			}

			res.json({
				code: 1,
				data: { ...userExist._doc, password: null },
				message: "Đăng nhập thành công",
			});
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [PUT] /users/:id/updatePasswordById
	async updatePasswordById(req, res, next) {
		try {
			// Lấy id từ params
			const userId = req.params.id;
			// Lấy password mới từ body của request
			const newPassword = req.body.password;

			// Xác thực password mới
			const { error } = userValidation.updatePassword(newPassword);
			if (error) {
				res.json({
					code: 4,
					message: error.message,
				});
				return;
			}

			// Tìm tài khoản người dùng để cập nhật mật khẩu mới (newPassword)
			const userFound = await UserSchema.findOne({
				_id: userId,
			});
			if (!userFound) {
				res.json({
					code: 5,
					message: "Không tìm thấy tài khoản người dùng",
				});
				return;
			}

			// Cập nhật mật khẩu mới (newPassword)
			userFound.password = newPassword;
			const saveUserResult = await userFound.save();

			res.json({
				code: 1,
				message: "Cập nhật mật khẩu tài khoản người dùng thành công",
			});
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}

	// [DELETE] /users/:id
	async deleteById(req, res, next) {
		try {
			// Lấy id từ params
			const userId = req.params.id;

			// Xóa tài khoản người dùng trong CSDL
			const deleteResult = await UserSchema.deleteOne({
				_id: userId,
			});

			if (deleteResult.deletedCount > 0) {
				res.json({
					code: 1,
					message: "Xóa người dùng thành công",
				});
			} else {
				res.json({
					code: 2,
					message: "Không tìm thấy người dùng cần xóa",
				});
			}
		} catch (error) {
			// Bắt lỗi
			next(error);
		}
	}
}

module.exports = new UserController();
