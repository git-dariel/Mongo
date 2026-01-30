export function sanitizeSelect(select: string): string {
  const fields = select
    .split(" ")
    .filter((field) => {
      const trimmed = field.trim();
      return trimmed !== "password" && trimmed !== "-password" && trimmed.length > 0;
    });
 
  if (fields.length > 0) {
    const hasExclusions = fields.some((field) => field.startsWith("-"));
    
    if (hasExclusions) {
      return fields.join(" ") + " -password";
    } else {
      return fields.join(" ");
    }
  }
  return "-password";
}