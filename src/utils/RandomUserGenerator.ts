import { allFakers } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import User from '../models/User';

export const generateRandomUser = (faker: any): User => {
    return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        phone: faker.phone.number(),
    };
};

function applyErrors(user: User, errorCount: number, rng: seedrandom.PRNG): User {
    const errorTypes: Array<'delete' | 'add' | 'swap'> = ['delete', 'add', 'swap'];
    const fields: Array<keyof User> = ['name', 'address', 'phone'];

    if (errorCount === 0) {
        return user;
    }

    // apply integer part of error with Seeded RNG
    const integerPart = Math.floor(errorCount);
    for (let i = 0; i < integerPart; i++) {
        const selectedField: keyof User = fields[Math.floor(rng() * fields.length)]; // pick random field
        const errorType: 'delete' | 'add' | 'swap' = errorTypes[Math.floor(rng() * errorTypes.length)]; // pick random error
        user = applyError(user, selectedField, errorType, rng);
    }

    // apply fractional part of error with same seeded RNG
    const fractionalPart = errorCount % 1;
    if (rng() < fractionalPart) {
        const selectedField: keyof User = fields[Math.floor(rng() * fields.length)];
        const errorType: 'delete' | 'add' | 'swap' = errorTypes[Math.floor(rng() * errorTypes.length)];
        user = applyError(user, selectedField, errorType, rng);
    }

    return user;
}


// apply error to field
function applyError(user: User, field: keyof User, errorType: 'delete' | 'add' | 'swap', rng: seedrandom.PRNG): User {
    const fieldValue = user[field];
    
    switch (errorType) {
        case 'delete':
            if (fieldValue.length > 1) { // can't make empty field
                user[field] = deleteRandomCharacter(fieldValue, rng);
            }
            break;
        case 'add':
            if (fieldValue.length < 100) { // avoid too long strings
                user[field] = addRandomCharacter(fieldValue, rng);
            }
            break;
        case 'swap':
            if (fieldValue.length > 1) { // ensure at least 2 characters to swap
                user[field] = swapRandomCharacters(fieldValue, rng);
            }
            break;
    }
    return user;
}

function deleteRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    if (str.length === 0) return str;
    const index = Math.floor(rng() * str.length);
    return str.slice(0, index) + str.slice(index + 1);
}

function addRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    const index = Math.floor(rng() * str.length);
    const randomChar = String.fromCharCode(Math.floor(rng() * 52) + 65); // A-Z (65-90) and a-z (97-122) range
    return str.slice(0, index) + randomChar + str.slice(index);
}

function swapRandomCharacters(str: string, rng: seedrandom.PRNG): string {
    if (str.length < 2) return str;
    const index = Math.floor(rng() * (str.length - 1));
    const chars = str.split('');
    [chars[index], chars[index + 1]] = [chars[index + 1], chars[index]];
    return chars.join('');
}

export const generateUsers = (localeId: string, seed: number, errorSize: number, page = 1): User[] => {
    const pageSize = page === 1 ? 20 : 10;
    const faker = allFakers[localeId as keyof typeof allFakers];
    const combinedSeed = seed + (page - 1);
    const rng = seedrandom(combinedSeed.toString());
    const seedValue = Math.floor(rng() * 1000000);

    faker.seed(seedValue);

    const users: User[] = Array.from({ length: pageSize }, () => {
        const user = generateRandomUser(faker);
        return applyErrors(user, errorSize, rng);
    });

    return users;
};
