
export class HttpResponse {
  static success(payload: { data: any; message: string }) {
    return {
      success: true,
      data: payload.data,
      message: payload.message,
    };
  }

  static badRequest(data: { data: any; message: string }) {
    return {
      success: false,
      data: data.data,
      message: data.message,
    };
  }
}
