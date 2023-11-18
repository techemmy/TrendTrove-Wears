import { type ValidationChain, body } from 'express-validator';

export const newProductFormValidators: ValidationChain[] = [
    body('name')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Product name is required'),
    body('price')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Product price is required')
        .toFloat()
        .isFloat({ min: 0 })
        .withMessage('Product price cannot be less than zero'),
    body('category')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Product category is required'),
    body('sizes')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('Choose at least one size'),
    body('shortDescription')
        .trim()
        .escape()
        .notEmpty()
        .withMessage('A short description of the product is required'),
];

export const userProfileFormValidator: ValidationChain[] = [
    body('name', 'Name is invalid or empty').trim().escape().notEmpty(),
    body('phoneNumber', 'Phone number cannot be empty')
        .trim()
        .escape()
        .notEmpty(),
    body('street', 'Street cannot be empty').trim().escape().notEmpty(),
    body('state', 'State cannot be empty').trim().escape().notEmpty(),
    body('country', 'Country cannot be empty').trim().escape().notEmpty(),
];
