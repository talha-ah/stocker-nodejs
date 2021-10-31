const errors = {
  error: "There was an error!",
  firstNameRequired: "First name is required",
  lastNameRequired: "Last name is required",
  emailRequired: "Email is required",
  emailInvalid: "Email is invalid",
  emailExists: "Email already exists",
  emailNotExists: "No user found with that Email!",
  oldPasswordRequired: "Old password is required",
  samePassword: "Same password not allowed",
  passwordInvalid: "Password is incorrect!",
  passwordRequired: "Password is required",
  passwordMin: "Password must have at least 8 characters",
  passwordCombination:
    "Password must contain at least one special character and one number",
  secretRequired: "Secret is required",
  secretInvalid: "Invalid secret",
  roleRequired: "Role is required",
  roleOnly: "Role must be [user, admin]",
  tokenRequired: "Token is required",
  tokenNotFound: "Unauthorized access: Token not found",
  invalidToken: "Invalid or expired token",
  userNotFound: "User does not exist",
  userIdRequired: "User ID is required",
  userIdLength: "User ID should be 24 characters",
  userNameExists: "Username is not available!",
  imageRequired: "Image is required",
  pendingEmailVerification: "Please verify your email address.",
  inactiveAccount: "Your account is not active! Kindly contact support!",
  alreadyVerified: "Account is already verified",
  notAuthorized: "Not authorized",

  // Category
  categoryIdRequired: "Category ID is required",
  categoryIdLength: "Category ID should be 24 characters",
  categoryNameRequired: "Category name is required",
  categoryNotFound: "Category not found",

  // Stock
  stockNotFound: "Stock not found",
  stockIdRequired: "Stock ID is required",
  stockIdLength: "Stock ID should be 24 characters",
  stockCostPriceRequired: "Stock cost price is required",
  stockSalePriceRequired: "Stock sale price is required",
  stockInventoryRequired: "Stock inventory is required",
  stockLocationRequired: "Stock location is required",
  stockCodeRequired: "Stock code is required",
}

const texts = {
  success: "Success",

  allUsers: "All users",
  userData: "User data",
  userCreated: "User created",
  userUpdated: "User updated",
  userDeleted: "User deleted",
  passwordSuccess: "Password updated",
  loginSuccess: "Logged in successfully",
  emailVerified: "Email verified successfully",
  passwordResetSent: "Password reset link sent",
  emailVerificationSent: "Email verfication link sent",
}

module.exports = {
  texts,
  errors,
}
