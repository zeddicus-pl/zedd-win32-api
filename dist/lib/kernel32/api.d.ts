import { DModel as M, FModel as FM } from 'win32-def';
export interface Win32Fns extends FM.DllFuncsModel {
    /**
     * https://msdn.microsoft.com/en-us/library/windows/desktop/ms679351(v=vs.85).aspx
     * dwLanguageId: https://msdn.microsoft.com/en-us/library/windows/desktop/dd318693(v=vs.85).aspx
     */
    FormatMessageW: (dwFlags: M.DWORD, lpSource: M.LPCVOID | null, dwMessageId: M.DWORD, dwLanguageId: M.DWORD, // 0x0409: US, 0x0000: Neutral locale language
    lpBuffer: M.LPTSTR, nSize: M.DWORD, Arguments: M.va_list | null) => M.DWORD;
    FreeConsole: () => M.BOOL;
    GenerateConsoleCtrlEvent: (dwCtrlEvent: M.DWORD, dwProcessGroupId: M.DWORD) => M.BOOL;
    /**
     * Not works correctly
     * @see https://github.com/node-ffi/node-ffi/issues/261
     */
    GetLastError: () => M.DWORD;
    GetModuleHandleW: (lpModuleName: M.LPCTSTR | null) => M.HMODULE;
    GetModuleHandleExW: (dwFlags: M.DWORD, lpModuleName: M.LPCTSTR | null, phModule: M.HMODULE) => M.BOOL;
    GetProcessHeaps: (NumberOfHeaps: M.DWORD, ProcessHeaps: M.PHANDLE) => M.DWORD;
    /** https://docs.microsoft.com/en-us/windows/desktop/api/processthreadsapi/nf-processthreadsapi-getsystemtimes */
    GetSystemTimes: (lpIdleTime: M.PFILETIME, lpKernelTime: M.PFILETIME, lpUserTime: M.PFILETIME) => M.BOOL;
    HeapFree: (hHeap: M.HANDLE, dwFlags: M.DWORD, lpMem: M.LPVOID | null) => M.BOOL;
    OpenProcess: (dwDesiredAccess: M.DWORD, bInheritHandle: M.BOOL, dwProcessId: M.DWORD) => M.HANDLE;
    /** https://msdn.microsoft.com/en-us/library/windows/desktop/aa363362(v=vs.85).aspx */
    OutputDebugStringW: (lpOutputString: M.LPCTSTR) => M.VOID;
    /** https://msdn.microsoft.com/en-us/library/windows/desktop/ms681381(v=vs.85).aspx */
    SetLastError: (dwErrCode: M.DWORD) => M.VOID;
    /**
     * Enables an application to inform the system that it is in use,
     * thereby preventing the system from entering sleep or turning off
     * the display while the application is running.
     *
     * @example
     * // Television recording is beginning. Enable away mode and prevent the sleep idle time-out.
     * SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED | ES_AWAYMODE_REQUIRED);
     *
     * // Clear EXECUTION_STATE flags to disable away mode and allow the system to idle to sleep normally.
     * SetThreadExecutionState(ES_CONTINUOUS);
     *
     * @param esFlags The thread's execution requirements.
     * This parameter can be one or more of the following values. Join them with single |
     * @returns If the function succeeds, the return value is the previous thread execution state.
     * If the function fails, the return value is NULL.
     * @see[Docs]{@link https://docs.microsoft.com/en-us/windows/desktop/api/winbase/nf-winbase-setthreadexecutionstate}
     *
     * Note: The return value NULL would be converted to zero by node-ffi
     */
    SetThreadExecutionState: (esFlags: M.UINT) => M.UINT;
}
export declare const apiDef: FM.DllFuncs;
