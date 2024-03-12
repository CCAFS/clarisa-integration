export class ClrisaMessageDto {
  OK: string;
  ERROR: string;
  FINALLY: string;
  START: string;
  NO_DATA_CREATE: string;
  DATA_PENDING_UPDATE: (count) => string;
  DATA_CREATED: (count) => string;
}
