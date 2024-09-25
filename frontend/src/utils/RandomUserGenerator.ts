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

function seededSample<T>(array: T[], rng: seedrandom.PRNG): T {
    const index = Math.floor(rng() * array.length);
    return array[index];
}

function applyErrors(user: User, errorCount: number, rng: seedrandom.PRNG): User {
    const errorTypes: Array<'delete' | 'add' | 'swap'> = ['delete', 'add', 'swap'];
    const fields: Array<keyof User> = ['name', 'address', 'phone'];

    if (errorCount === 0) {
        return user;
    }

    const integerPart = Math.floor(errorCount);
    for (let i = 0; i < integerPart; i++) {
        const selectedField = seededSample(fields, rng);
        const errorType = seededSample(errorTypes, rng);
        user = applyError(user, selectedField, errorType, rng);
    }

    const fractionalPart = errorCount % 1;
    if (rng() < fractionalPart) {
        const selectedField = seededSample(fields, rng);
        const errorType = seededSample(errorTypes, rng);
        user = applyError(user, selectedField, errorType, rng);
    }

    return user;
}

function applyError(user: User, field: keyof User, errorType: 'delete' | 'add' | 'swap', rng: seedrandom.PRNG): User {
    switch (errorType) {
        case 'delete':
            if (user[field]) user[field] = deleteRandomCharacter(user[field], rng);
            break;
        case 'add':
            if (user[field]) user[field] = addRandomCharacter(user[field], rng);
            break;
        case 'swap':
            if (user[field]) user[field] = swapRandomCharacters(user[field], rng);
            break;
    }
    return user;
}

function deleteRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    const index = Math.floor(rng() * str.length);
    return str.slice(0, index) + str.slice(index + 1);
}

function addRandomCharacter(str: string, rng: seedrandom.PRNG): string {
    const index = Math.floor(rng() * str.length);
    const randomChar = String.fromCharCode(Math.floor(rng() * 26) + 97);
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

