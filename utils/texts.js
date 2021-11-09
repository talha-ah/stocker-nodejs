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

  // Customers
  customerIdRequired: "Customer ID is required",
  customerIdLength: "Customer ID should be 24 characters",
  customerNameRequired: "Customer name is required",
  customerNotFound: "Customer not found",

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

  // Order
  orderNotFound: "Order not found",
  orderIdRequired: "Order ID is required",
  orderIdLength: "Order ID should be 24 characters",
  orderCreatedForLength: "Customer ID should be 24 characters",
  orderCreatedForRequired: "Customer is required",
  orderDisplayIdRequired: "Display Id is required",
  orderQuantityRequired: "Quantity is required",
  orderPriceRequired: "Price is required",
  orderDiscountRequired: "Discount is required",
  orderDiscountTypeRequired: "Discount type is required",
  orderDiscountTypeValid: "Discount type should be [percentage, fixed]",
  orderPaymentRequired: "Payment is required",
  orderPaymentTypeRequired: "Payment type is required",
  orderPaymentTypeValid: "Payment type should be [cash, installments]",
  orderPaymentInstallmentsRequired: "Payment installments is required",
  orderStatusRequired: "Status is required",
  orderStatusValid: "Status should be [active, shipped, fulfilled]",
  orderStatusQuotationValid: "Status should be [active, quotation]",
  orderTypeCash: "Order does not require payments",
  orderTypeQuotation: "Unable to add payment for quotation",
  orderTotalPriceLessThanPayment:
    "Unable to add payment for more than the required value",
  orderStatusInvalid: "Status is invalid",
  orderStockInventoryInvalid: "Inventory not available for",
  noPendingPayment: "No payment is pending",
}

const texts = {
  success: "Success",

  users: "Users",
  orders: "Orders",
  stocks: "Stocks",
  profile: "Profile",
  customers: "Customers",
  categories: "Categories",
  loginSuccess: "Logged in successfully",
  emailVerified: "Email verified successfully",
  passwordResetSent: "Password reset link sent",
  emailVerificationSent: "Email verfication link sent",
}

module.exports = {
  texts,
  errors,
}
