export function UseDto(dto: any): ClassDecorator {
  return (target: any) => {
    target.prototype.dtoClass = dto;
  };
} 