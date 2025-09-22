import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('DateTime', () => Date)
export class DateTimeScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type';

  parseValue(value: string): Date {
    return new Date(value); // value from the client
  }

  serialize(value: Date | string): string {
    if (!value) {
      return null;
    }
    
    // Si ya es un string, devolverlo directamente
    if (typeof value === 'string') {
      return value;
    }
    
    // Si es un objeto Date, usar toISOString
    if (value instanceof Date && typeof value.toISOString === 'function') {
      return value.toISOString();
    }
    
    // Si no es ninguno de los anteriores, intentar convertir a string
    return String(value);
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  }
}
