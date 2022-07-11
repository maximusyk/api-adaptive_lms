import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

interface IsFileOptions {
    mime: ('application/msword' | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' | 'application/json')[];
}

export function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return value?.mimetype && (options?.mime ?? []).includes(value?.mimetype);
                },
            },
        });
    };
}