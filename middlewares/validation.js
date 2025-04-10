// middlewares/validation.js

export const idValidation = (req, res, next) => {
  const id = parseInt(req.params.id, 10);

  if (!isNaN(id) && Number.isInteger(id)) {
    req.id = id;
    return next();
  }

  res.status(400).json({ error: "Ogiltigt ID. Måste vara ett heltal." });
};

//  Validation body ** add items/ update items **
export const itemValidation = (req, res, next) => {
  const { title, desc, price, in_stock, is_cold, category_id } = req.body;

  // Array för att kolla igenom så att båda är av string.
  const stringArray = [title, desc];
  /* vi går igenom med every, om båda är string blir och det inte är en tom "" sträng
    validString true. */
  const validString = stringArray.every(
    (string) => typeof string === "string" && string.trim().length > 0
  );
  // Lika dant här som innan fast number.
  const numberArray = [price, category_id];
  // om båda är number så blir validNumber true.
  const validNumber = numberArray.every((number) => typeof number === "number");
  /* Lika dant här fast nu vill vi kolla så att varje boolean innehåller en 1 eller 0 
  eftersom det är bara det som ska gå att skicka in.*/
  const booleanArray = [is_cold, in_stock];
  // Om det är 1 eller 0 blir validBoolean true.
  const validBoolean = booleanArray.every(
    (boolean) => boolean === 1 || boolean === 0
  );

  // Fel kod om någon av dom ovvanför inte uppfyller kriterierna.
  if (!validString || !validNumber || !validBoolean) {
    return res.status(400).json({
      error: `All fields are required.
      - Title & Description must be strings.
      - Price & Category ID must be numbers.
      - in_stock & is_cold must be either 0 or 1.`,
    });
  }
  // För att säkerställa våran validering körde.
  console.log(`Validation for item was succesful`);

  // Klar på middleware. allt är validerat.
  next();
};

// Validation body ** add category / update categoy
export const categoriesValidation = (req, res, next) => {
  const { name } = req.body;
  /* Kollar så namn inte är falsey, dvs undefined eller null. 
      om name är falsey blir !name true, om name inte är en sträng blir den true,
      och om name längden på name efter trim är mindra eller lika med 0.
      så skrivs fel medelande ut.*/
  if (!name || typeof name !== "string" || name.trim().length <= 0) {
    return res.status(400).json({
      error:
        "Category name is required and cannot be empty or contain only spaces.",
    });
  }
  // För att säkerställa våran validering körde.
  console.log(`Validation for category was successful`);
  // Klar på middleware. allt är validerat.
  next();
};

// Validation body ** user id **
export const userValidation = (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id || typeof user_id !== "string" || user_id.trim().length <= 0) {
    return res
      .status(400)
      .json({ error: `Valid user_id is required and must be a string.` });
  }
  console.log(`User Id validation succesful`);

  req.user_id = user_id;
  next();
};
