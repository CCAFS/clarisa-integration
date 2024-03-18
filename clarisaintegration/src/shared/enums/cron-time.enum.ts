import { CronExpression } from '@nestjs/schedule';

export class CronTime {
  static readonly EVERY_MINUTE = new CronTime(
    CronExpression.EVERY_MINUTE,
    '1m',
  );
  static readonly EVERY_10_MINUTES = new CronTime(
    CronExpression.EVERY_10_MINUTES,
    '10m',
  );

  static readonly EVERY_30_MINUTES = new CronTime(
    CronExpression.EVERY_30_MINUTES,
    '30m',
  );

  static readonly EVERY_HOUR = new CronTime(CronExpression.EVERY_HOUR, '1h');

  static readonly EVERY_2_HOURSs = new CronTime(
    CronExpression.EVERY_2_HOURS,
    '2h',
  );

  static readonly EVERY_4_HOURS = new CronTime(
    CronExpression.EVERY_4_HOURS,
    '4h',
  );

  static readonly EVERY_8_HOURS = new CronTime(
    CronExpression.EVERY_8_HOURS,
    '8h',
  );

  static readonly EVERY_12_HOURS = new CronTime(
    CronExpression.EVERY_12_HOURS,
    '12h',
  );

  static readonly EVERY_DAY = new CronTime(
    CronExpression.EVERY_DAY_AT_2AM,
    '1d',
  );

  private constructor(
    public readonly value: CronExpression,
    public readonly name: string,
  ) {}

  public static getFromName(name: string): CronTime | undefined {
    return (Object.values(this) as CronTime[]).find((n) => n.name === name);
  }
  public static getFromValue(value: string): CronTime | undefined {
    return (Object.values(this) as CronTime[]).find((n) => n.value === value);
  }
  public static getArray(): string[] {
    return (Object.values(this) as CronTime[]).map((n) => n.name);
  }
}
