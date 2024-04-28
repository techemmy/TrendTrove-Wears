import 'dotenv/config';
import db from '.';
import mailerConfig from '../config/mailerConfig';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import { type ProductAttributes } from '../types/models/productTypes';
import { faker } from '@faker-js/faker';
import { UserRoleEnum } from '../types/models/userTypes';

const products = [] as ProductAttributes[];
for (let i = 0; i < 5; i++) {
    products.push({
        name: faker.commerce.productName(),
        price: faker.number.float({ min: 5, max: 1500, fractionDigits: 2 }),
        category: faker.helpers.arrayElement(PRODUCT_CATEGORIES),
        sizes: faker.helpers.arrayElements(Object.keys(PRODUCT_SIZES)),
        shortDescription: faker.word.words({ count: { min: 3, max: 10 } }),
        longDescription: faker.commerce.productDescription(),
        available: faker.datatype.boolean(),
        imageURL: faker.image.urlLoremFlickr({ category: 'clothes' }),
    });
}

(async () => {
    const mailerAccountExists = await db.users.findOne({
        where: {
            email: mailerConfig.MAILER_USER,
        },
    });
    if (mailerAccountExists != null) {
        await db.users.update(
            { role: UserRoleEnum.admin },
            {
                where: {
                    email: mailerConfig.MAILER_USER,
                },
            }
        );
    }

    await db.products.bulkCreate(products);
})()
    .then(() => {
        console.log('[DB Seeding] successful');
    })
    .catch((err) => {
        console.log('[DB Seeding Error]:', err);
    });
