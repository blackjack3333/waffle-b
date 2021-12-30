export class ApiError extends Error {
    constructor(
        message: string = 'Something went wrong. Please try again.',
        private code: number,
        private data: Record<string, unknown> = {},
        processCode?: number
    ) {
        super();

        if (processCode) {
            this.data.processCode = processCode;
        }
        this.message = message;
    }

    getCode(): number {
        return this.code;
    }

    getData(): any {
        return this.data;
    }

    getName(): string {
        return this.name;
    }

    getMessage(): string {
        return this.message;
    }
}
