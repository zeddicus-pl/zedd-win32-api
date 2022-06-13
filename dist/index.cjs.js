/**
 * tc-win32-api
 * FFI definitions of windows win32 api for node-ffi
 *
 * @version 10.0.1
 * @author waiting
 * @license MIT
 * @link https://waitingsong.github.io/node-win32-api
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var win32Def = require('win32-def');
var ref = require('ref-napi');
var _UnionDi = require('ref-union-di');
var ffi = require('ffi-napi');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var ref__namespace = /*#__PURE__*/_interopNamespace(ref);
var _UnionDi__namespace = /*#__PURE__*/_interopNamespace(_UnionDi);
var ffi__namespace = /*#__PURE__*/_interopNamespace(ffi);

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fixed length "Buffer" type, for use in Struct type definitions.
 *
 * Optionally setting the `encoding` param will force to call
 * `toString(encoding)` on the buffer returning a String instead.
 *
 * @see https://github.com/TooTallNate/ref-struct/issues/28#issuecomment-265626611
 * @ref https://gist.github.com/TooTallNate/80ac2d94b950216a2705
 */
function BufferTypeFactory(length, encoding) {
    const inst = Object.create(ref__namespace.types.byte, {
        constructor: {
            configurable: true,
            enumerable: false,
            writable: true,
            value: BufferTypeFactory,
        },
    });
    Object.defineProperty(inst, 'size', {
        configurable: true,
        enumerable: true,
        writable: false,
        value: length,
    });
    Object.defineProperty(inst, 'encoding', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: encoding,
    });
    Object.defineProperty(inst, 'get', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: getFn,
    });
    Object.defineProperty(inst, 'set', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: setFn,
    });
    return inst;
}
function getFn(buffer, offset) {
    const buf = buffer.slice(offset, offset + this.size);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.encoding) {
        const str = buf.toString(this.encoding);
        return str;
    }
    return buf;
}
function setFn(buffer, offset, value) {
    let target;
    if (typeof value === 'string') {
        target = Buffer.from(value, this.encoding);
    }
    else if (Array.isArray(value)) {
        target = Buffer.from(value);
    }
    else if (Buffer.isBuffer(value)) {
        target = value;
    }
    else {
        throw new TypeError('Buffer instance expected');
    }
    if (target.length > this.size) {
        throw new Error(`Buffer given is ${target.length} bytes, but only ${this.size} bytes available`);
    }
    target.copy(buffer, offset);
}

/* eslint-disable id-length */
/** https://docs.microsoft.com/zh-cn/windows/win32/api/wingdi/ns-wingdi-display_devicew */
const DISPLAY_DEVICEW = {
    cb: win32Def.DTypes.DWORD,
    DeviceName: BufferTypeFactory(32, 'ucs2'),
    DeviceString: BufferTypeFactory(128, 'ucs2'),
    StateFlags: win32Def.DTypes.DWORD,
    DeviceID: BufferTypeFactory(128, 'ucs2'),
    DeviceKey: BufferTypeFactory(128, 'ucs2'),
};

const UnionDi = _UnionDi__namespace;
const Union = UnionDi.default(ref__namespace);

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/** https://docs.microsoft.com/zh-cn/windows/win32/api/winuser/ns-winuser-rid_device_info */
const RID_DEVICE_INFO = {
    cbSize: win32Def.DTypes.DWORD,
    dwType: win32Def.DTypes.DWORD,
    DUMMYUNIONNAME: Union(win32Def.DUnion.RID_DEVICE_INFO_DUMMYUNIONNAME),
};

/* eslint-disable id-length */

var index$4 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DISPLAY_DEVICEW: DISPLAY_DEVICEW,
    RID_DEVICE_INFO: RID_DEVICE_INFO
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const dllInst = new Map(); // for DLL.load() with settings.singleton === true
function load$4(dllName, dllFuncs, fns, settings) {
    const st = parse_settings(settings);
    if (st.singleton) {
        let inst = get_inst_by_name(dllName);
        if (!inst) {
            inst = ffi__namespace.Library(dllName, gen_api_opts(dllFuncs, fns));
            set_inst_by_name(dllName, inst);
        }
        return inst;
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return ffi__namespace.Library(dllName, gen_api_opts(dllFuncs, fns));
    }
}
/**
 * Generate function definitions via converting macro windows data type (like PVOID) to the expected value.
 * Skip assignment if property undefined
 */
function gen_api_opts(dllFuncs, fns) {
    const ret = {};
    if (fns && Array.isArray(fns) && fns.length) {
        for (const fn of fns) {
            const ps = dllFuncs[fn];
            if (typeof ps !== 'undefined') {
                Object.defineProperty(ret, fn, {
                    value: ps,
                    writable: false,
                    enumerable: true,
                    configurable: false,
                });
            }
        }
    }
    else {
        for (const fn of Object.keys(dllFuncs)) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const ps = dllFuncs[fn];
            if (typeof ps !== 'undefined') {
                Object.defineProperty(ret, fn, {
                    value: ps,
                    writable: false,
                    enumerable: true,
                    configurable: false,
                });
            }
        }
    }
    return ret;
}
function get_inst_by_name(dllName) {
    return dllInst.get(dllName);
}
function set_inst_by_name(dllName, inst) {
    dllInst.set(dllName, inst);
}
function parse_settings(settings) {
    const st = { ...win32Def.Config.settingsDefault };
    if (typeof settings !== 'undefined' && Object.keys(settings).length) {
        Object.assign(st, settings);
    }
    return st;
}

const apiDef$3 = {
    InitCommonControlsEx: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPINITCOMMONCONTROLSEX]],
};

const dllName$3 = "comctl32" /* comctl32 */;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const load$3 = (fns, settings) => load$4(dllName$3, apiDef$3, fns, settings);

var index$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    apiDef: apiDef$3,
    dllName: dllName$3,
    load: load$3
});

const apiDef$2 = {
    FormatMessageW: [
        win32Def.DTypes.DWORD,
        [win32Def.DTypes.DWORD, win32Def.DTypes.LPCVOID, win32Def.DTypes.DWORD, win32Def.DTypes.DWORD, win32Def.DTypes.LPTSTR, win32Def.DTypes.DWORD, win32Def.DTypes.va_list],
    ],
    FreeConsole: [win32Def.DTypes.BOOL, []],
    GenerateConsoleCtrlEvent: [win32Def.DTypes.BOOL, [win32Def.DTypes.DWORD, win32Def.DTypes.DWORD]],
    /** err code: https://msdn.microsoft.com/zh-cn/library/windows/desktop/ms681381(v=vs.85).aspx */
    GetLastError: [win32Def.DTypes.DWORD, []],
    /** retrive value from buf by ret.ref().readUInt32() */
    GetModuleHandleW: [win32Def.DTypes.HMODULE, [win32Def.DTypes.LPCTSTR]],
    /** flags, optional LPCTSTR name, ref hModule */
    GetModuleHandleExW: [win32Def.DTypes.BOOL, [win32Def.DTypes.DWORD, win32Def.DTypes.LPCTSTR, win32Def.DTypes.HMODULE]],
    GetProcessHeaps: [win32Def.DTypes.DWORD, [win32Def.DTypes.DWORD, win32Def.DTypes.PHANDLE]],
    GetSystemTimes: [win32Def.DTypes.BOOL, [win32Def.DTypes.PFILETIME, win32Def.DTypes.PFILETIME, win32Def.DTypes.PFILETIME]],
    HeapFree: [win32Def.DTypes.BOOL, [win32Def.DTypes.HANDLE, win32Def.DTypes.DWORD, win32Def.DTypes.LPVOID]],
    OpenProcess: [win32Def.DTypes.HANDLE, [win32Def.DTypes.DWORD, win32Def.DTypes.BOOL, win32Def.DTypes.DWORD]],
    OutputDebugStringW: [win32Def.DTypes.VOID, [win32Def.DTypes.LPCTSTR]],
    SetLastError: [win32Def.DTypes.VOID, [win32Def.DTypes.DWORD]],
    SetThreadExecutionState: [win32Def.DTypes.INT, [win32Def.DTypes.INT]],
};

const dllName$2 = "kernel32" /* kernel32 */;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const load$2 = (fns, settings) => load$4(dllName$2, apiDef$2, fns, settings);

var index$2 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    apiDef: apiDef$2,
    dllName: dllName$2,
    load: load$2
});

const apiDef$1 = {
    NtQueryInformationProcess: [win32Def.DTypes.NTSTATUS, [win32Def.DTypes.HANDLE, win32Def.DTypes.DWORD32, win32Def.DTypes.PVOID, win32Def.DTypes.ULONG, win32Def.DTypes.PULONG]],
};

const dllName$1 = "ntdll" /* ntdll */;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const load$1 = (fns, settings) => load$4(dllName$1, apiDef$1, fns, settings);

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    apiDef: apiDef$1,
    dllName: dllName$1,
    load: load$1
});

const apiDef = {
    BringWindowToTop: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
    /** url: https://docs.microsoft.com/en-us/windows/desktop/api/winuser/nf-winuser-clienttoscreen */
    ClientToScreen: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.LPPOINT]],
    CloseWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
    CreateWindowExW: [
        win32Def.DTypes.HWND, [
            win32Def.DTypes.DWORD, win32Def.DTypes.LPCTSTR, win32Def.DTypes.LPCTSTR, win32Def.DTypes.DWORD,
            win32Def.DTypes.INT, win32Def.DTypes.INT, win32Def.DTypes.INT, win32Def.DTypes.INT,
            win32Def.DTypes.HWND, win32Def.DTypes.HMENU, win32Def.DTypes.HINSTANCE, win32Def.DTypes.LPVOID,
        ],
    ],
    DefWindowProcW: [win32Def.DTypes.LRESULT, [win32Def.DTypes.HWND, win32Def.DTypes.UINT, win32Def.DTypes.WPARAM, win32Def.DTypes.LPARAM]],
    DestroyWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
    DispatchMessageW: [win32Def.DTypes.LRESULT, [win32Def.DTypes.LPMSG]],
    /** https://docs.microsoft.com/zh-cn/windows/win32/api/winuser/nf-winuser-enumdisplaydevicesw */
    EnumDisplayDevicesW: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPCWSTR, win32Def.DTypes.DWORD, win32Def.DTypes.POINT, win32Def.DTypes.DWORD]],
    EnumThreadWindows: [win32Def.DTypes.BOOL, [win32Def.DTypes.DWORD, win32Def.DTypes.WNDENUMPROC, win32Def.DTypes.LPARAM]],
    EnumWindows: [win32Def.DTypes.BOOL, [win32Def.DTypes.WNDENUMPROC, win32Def.DTypes.LPARAM]],
    FindWindowExW: [win32Def.DTypes.HWND, [win32Def.DTypes.HWND, win32Def.DTypes.HWND, win32Def.DTypes.LPCTSTR, win32Def.DTypes.LPCTSTR]],
    GetAncestor: [win32Def.DTypes.HWND, [win32Def.DTypes.HWND, win32Def.DTypes.UINT]],
    GetAltTabInfoW: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.INT, win32Def.DTypes.INT, win32Def.DTypes.LPWSTR, win32Def.DTypes.INT]],
    GetClassInfoExW: [win32Def.DTypes.BOOL, [win32Def.DTypes.HINSTANCE, win32Def.DTypes.LPCTSTR, win32Def.DTypes.LPWNDCLASSEX]],
    GetForegroundWindow: [win32Def.DTypes.HWND, []],
    GetMessageW: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPMSG, win32Def.DTypes.HWND, win32Def.DTypes.UINT, win32Def.DTypes.UINT]],
    GetParent: [win32Def.DTypes.HWND, [win32Def.DTypes.HWND]],
    GetRawInputDeviceInfoW: [win32Def.DTypes.UINT, [win32Def.DTypes.HANDLE, win32Def.DTypes.UINT, win32Def.DTypes.LPVOID, win32Def.DTypes.PUINT]],
    GetRawInputDeviceList: [win32Def.DTypes.INT, [win32Def.DTypes.PRAWINPUTDEVICELIST, win32Def.DTypes.PUINT, win32Def.DTypes.UINT]],
    GetTopWindow: [win32Def.DTypes.HWND, [win32Def.DTypes.HWND]],
    GetWindow: [win32Def.DTypes.HWND, [win32Def.DTypes.HWND, win32Def.DTypes.UINT]],
    GetWindowInfo: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.PWINDOWINFO]],
    GetWindowLongW: [win32Def.DTypes.LONG, [win32Def.DTypes.HWND, win32Def.DTypes.INT]],
    GetWindowRect: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.RECT]],
    GetWindowTextW: [win32Def.DTypes.INT, [win32Def.DTypes.HWND, win32Def.DTypes.LPTSTR, win32Def.DTypes.INT]],
    GetWindowThreadProcessId: [win32Def.DTypes.DWORD, [win32Def.DTypes.HWND, win32Def.DTypes.LPDWORD]],
    IsWindowVisible: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
    PeekMessageW: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPMSG, win32Def.DTypes.HWND, win32Def.DTypes.UINT, win32Def.DTypes.UINT, win32Def.DTypes.UINT]],
    PostMessageW: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.UINT, win32Def.DTypes.WPARAM, win32Def.DTypes.LPARAM]],
    PrintWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.HDC, win32Def.DTypes.UINT]],
    RegisterClassExW: [win32Def.DTypes.ATOM, [win32Def.DTypes.WNDCLASSEX]],
    SendMessageW: [win32Def.DTypes.LRESULT, [win32Def.DTypes.HWND, win32Def.DTypes.UINT, win32Def.DTypes.WPARAM, win32Def.DTypes.LPARAM]],
    SetForegroundWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
    SetWindowTextW: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.LPCTSTR]],
    SetWinEventHook: [win32Def.DTypes.HWINEVENTHOOK, [win32Def.DTypes.UINT, win32Def.DTypes.UINT, win32Def.DTypes.HMODULE, win32Def.DTypes.WINEVENTPROC, win32Def.DTypes.DWORD, win32Def.DTypes.DWORD, win32Def.DTypes.UINT]],
    ShowWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND, win32Def.DTypes.INT]],
    TranslateMessage: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPMSG]],
    TranslateMessageEx: [win32Def.DTypes.BOOL, [win32Def.DTypes.LPMSG]],
    UnhookWinEvent: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWINEVENTHOOK]],
    UpdateWindow: [win32Def.DTypes.BOOL, [win32Def.DTypes.HWND]],
};
/* istanbul ignore next */
if (process.arch === 'x64') {
    apiDef.GetWindowLongPtrW = [win32Def.DTypes.LONG_PTR, [win32Def.DTypes.HWND, win32Def.DTypes.INT]];
}

/* eslint-disable no-bitwise */
/* --------- Window Styles ---------------- */
// https://msdn.microsoft.com/en-us/library/windows/desktop/ms632600(v=vs.85).aspx
const WS_BORDER = 0x00800000;
const WS_CAPTION = 0x00C00000;
const WS_CHILD = 0x40000000;
const WS_CLIPCHILDREN = 0x02000000;
const WS_CLIPSIBLINGS = 0x04000000;
const WS_DISABLED = 0x08000000;
const WS_DLGFRAME = 0x00400000;
const WS_GROUP = 0x00020000;
const WS_HSCROLL = 0x00100000;
const WS_ICONIC = 0x20000000;
const WS_MAXIMIZE = 0x01000000;
const WS_MAXIMIZEBOX = 0x00010000;
const WS_MINIMIZE = 0x20000000;
const WS_MINIMIZEBOX = 0x00020000;
const WS_OVERLAPPED = 0x00000000;
const WS_POPUP = 0x80000000; // The windows is a pop-up window
const WS_SIZEBOX = 0x00040000;
const WS_SYSMENU = 0x00080000; // The window has a window menu on its title bar.
const WS_TABSTOP = 0x00010000;
const WS_THICKFRAME = 0x00040000;
const WS_TILED = 0x00000000;
const WS_VISIBLE = 0x10000000;
const WS_VSCROLL = 0x00200000;
const WS_OVERLAPPEDWINDOW = WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU
    | WS_THICKFRAME | WS_MINIMIZEBOX | WS_MAXIMIZEBOX;
const WS_POPUPWINDOW = WS_POPUP | WS_BORDER | WS_SYSMENU;
const WS_TILEDWINDOW = WS_OVERLAPPED | WS_CAPTION | WS_SYSMENU
    | WS_THICKFRAME | WS_MINIMIZEBOX | WS_MAXIMIZEBOX;
/* --------- Extended Window Styles ---------------- */
// https://docs.microsoft.com/en-us/windows/win32/winmsg/extended-window-styles
// https://msdn.microsoft.com/en-us/library/windows/desktop/ff700543(v=vs.85).aspx
const WS_EX_ACCEPTFILES = 0x00000010;
const WS_EX_APPWINDOW = 0x00040000;
const WS_EX_CLIENTEDGE = 0x00000200;
const WS_EX_COMPOSITED = 0x02000000;
const WS_EX_CONTEXTHELP = 0x00000400;
const WS_EX_CONTROLPARENT = 0x00010000;
const WS_EX_DLGMODALFRAME = 0x00000001;
const WS_EX_LAYERED = 0x00080000;
const WS_EX_LAYOUTRTL = 0x00400000;
const WS_EX_LEFT = 0x00000000;
const WS_EX_LEFTSCROLLBAR = 0x00004000;
const WS_EX_LTRREADING = 0x00000000;
const WS_EX_MDICHILD = 0x00000040;
const WS_EX_NOACTIVATE = 0x08000000;
const WS_EX_NOINHERITLAYOUT = 0x00100000;
const WS_EX_NOPARENTNOTIFY = 0x00000004;
const WS_EX_NOREDIRECTIONBITMAP = 0x00200000;
const WS_EX_RIGHT = 0x00001000;
const WS_EX_RIGHTSCROLLBAR = 0x00000000;
const WS_EX_RTLREADING = 0x00002000;
const WS_EX_STATICEDGE = 0x00020000;
const WS_EX_TOOLWINDOW = 0x00000080;
const WS_EX_TOPMOST = 0x00000008;
const WS_EX_TRANSPARENT = 0x00000020;
const WS_EX_WINDOWEDGE = 0x00000100;
const WS_EX_OVERLAPPEDWINDOW = WS_EX_WINDOWEDGE | WS_EX_CLIENTEDGE;
const WS_EX_PALETTEWINDOW = WS_EX_WINDOWEDGE | WS_EX_TOOLWINDOW | WS_EX_TOPMOST;
const PM_NOREMOVE = 0x0000;
const PM_REMOVE = 0x0001;
const PM_NOYIELD = 0x0002;
const CW_USEDEFAULT = 1 << 31;

var constants = /*#__PURE__*/Object.freeze({
    __proto__: null,
    WS_BORDER: WS_BORDER,
    WS_CAPTION: WS_CAPTION,
    WS_CHILD: WS_CHILD,
    WS_CLIPCHILDREN: WS_CLIPCHILDREN,
    WS_CLIPSIBLINGS: WS_CLIPSIBLINGS,
    WS_DISABLED: WS_DISABLED,
    WS_DLGFRAME: WS_DLGFRAME,
    WS_GROUP: WS_GROUP,
    WS_HSCROLL: WS_HSCROLL,
    WS_ICONIC: WS_ICONIC,
    WS_MAXIMIZE: WS_MAXIMIZE,
    WS_MAXIMIZEBOX: WS_MAXIMIZEBOX,
    WS_MINIMIZE: WS_MINIMIZE,
    WS_MINIMIZEBOX: WS_MINIMIZEBOX,
    WS_OVERLAPPED: WS_OVERLAPPED,
    WS_POPUP: WS_POPUP,
    WS_SIZEBOX: WS_SIZEBOX,
    WS_SYSMENU: WS_SYSMENU,
    WS_TABSTOP: WS_TABSTOP,
    WS_THICKFRAME: WS_THICKFRAME,
    WS_TILED: WS_TILED,
    WS_VISIBLE: WS_VISIBLE,
    WS_VSCROLL: WS_VSCROLL,
    WS_OVERLAPPEDWINDOW: WS_OVERLAPPEDWINDOW,
    WS_POPUPWINDOW: WS_POPUPWINDOW,
    WS_TILEDWINDOW: WS_TILEDWINDOW,
    WS_EX_ACCEPTFILES: WS_EX_ACCEPTFILES,
    WS_EX_APPWINDOW: WS_EX_APPWINDOW,
    WS_EX_CLIENTEDGE: WS_EX_CLIENTEDGE,
    WS_EX_COMPOSITED: WS_EX_COMPOSITED,
    WS_EX_CONTEXTHELP: WS_EX_CONTEXTHELP,
    WS_EX_CONTROLPARENT: WS_EX_CONTROLPARENT,
    WS_EX_DLGMODALFRAME: WS_EX_DLGMODALFRAME,
    WS_EX_LAYERED: WS_EX_LAYERED,
    WS_EX_LAYOUTRTL: WS_EX_LAYOUTRTL,
    WS_EX_LEFT: WS_EX_LEFT,
    WS_EX_LEFTSCROLLBAR: WS_EX_LEFTSCROLLBAR,
    WS_EX_LTRREADING: WS_EX_LTRREADING,
    WS_EX_MDICHILD: WS_EX_MDICHILD,
    WS_EX_NOACTIVATE: WS_EX_NOACTIVATE,
    WS_EX_NOINHERITLAYOUT: WS_EX_NOINHERITLAYOUT,
    WS_EX_NOPARENTNOTIFY: WS_EX_NOPARENTNOTIFY,
    WS_EX_NOREDIRECTIONBITMAP: WS_EX_NOREDIRECTIONBITMAP,
    WS_EX_RIGHT: WS_EX_RIGHT,
    WS_EX_RIGHTSCROLLBAR: WS_EX_RIGHTSCROLLBAR,
    WS_EX_RTLREADING: WS_EX_RTLREADING,
    WS_EX_STATICEDGE: WS_EX_STATICEDGE,
    WS_EX_TOOLWINDOW: WS_EX_TOOLWINDOW,
    WS_EX_TOPMOST: WS_EX_TOPMOST,
    WS_EX_TRANSPARENT: WS_EX_TRANSPARENT,
    WS_EX_WINDOWEDGE: WS_EX_WINDOWEDGE,
    WS_EX_OVERLAPPEDWINDOW: WS_EX_OVERLAPPEDWINDOW,
    WS_EX_PALETTEWINDOW: WS_EX_PALETTEWINDOW,
    PM_NOREMOVE: PM_NOREMOVE,
    PM_REMOVE: PM_REMOVE,
    PM_NOYIELD: PM_NOYIELD,
    CW_USEDEFAULT: CW_USEDEFAULT
});

const dllName = "user32" /* user32 */;
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const load = (fns, settings) => load$4(dllName, apiDef, fns, settings);

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    apiDef: apiDef,
    constants: constants,
    dllName: dllName,
    load: load
});

/**
 * https://docs.microsoft.com/en-us/windows/win32/winmsg/windowing
 */
// https://docs.microsoft.com/zh-cn/windows/win32/winmsg/window-messages
const MN_GETHMENU = 0x01E1;
const WM_ERASEBKGND = 0x0014;
const WM_GETFONT = 0x0031;
const WM_GETTEXT = 0x000D;
const WM_GETTEXTLENGTH = 0x000E;
const WM_SETFONT = 0x0030;
const WM_SETICON = 0x0080;
const WM_SETTEXT = 0x000C;
// https://docs.microsoft.com/zh-cn/windows/win32/winmsg/window-notifications
const WM_ACTIVATEAPP = 0x001C;
const WM_CANCELMODE = 0x001F;
const WM_CHILDACTIVATE = 0x0022;
const WM_CLOSE = 0x0010;
const WM_CREATE = 0x0001;
const WM_DESTROY = 0x0002;
const WM_ENABLE = 0x000A;
const WM_ENTERSIZEMOVE = 0x0231;
const WM_EXITSIZEMOVE = 0x0232;
const WM_GETICON = 0x007F;
const WM_GETMINMAXINFO = 0x0024;
const WM_INPUTLANGCHANGE = 0x0051;
const WM_INPUTLANGCHANGEREQUEST = 0x0050;
const WM_MOVE = 0x0003;
const WM_MOVING = 0x0216;
const WM_NCACTIVATE = 0x0086;
const WM_NCCALCSIZE = 0x0083;
const WM_NCCREATE = 0x0081;
const WM_NCDESTROY = 0x0082;
const WM_NULL = 0x0000;
const WM_QUERYDRAGICON = 0x0037;
const WM_QUERYOPEN = 0x0013;
const WM_QUIT = 0x0012;
const WM_SHOWWINDOW = 0x0018;
const WM_SIZE = 0x0005;
const WM_SIZING = 0x0214;
const WM_STYLECHANGED = 0x007D;
const WM_STYLECHANGING = 0x007C;
const WM_THEMECHANGED = 0x031A;
const WM_USERCHANGED = 0x0054;
const WM_WINDOWPOSCHANGED = 0x0047;
const WM_WINDOWPOSCHANGING = 0x0046;
/** https://docs.microsoft.com/en-us/windows/win32/dataxchg/wm-copydata */
const WM_COPYDATA = 0x004A;
// https://docs.microsoft.com/en-us/windows/win32/menurc/menu-notifications
const WM_COMMAND = 0x0111;
const WM_CONTEXTMENU = 0x007B;
const WM_ENTERMENULOOP = 0x0211;
const WM_EXITMENULOOP = 0x0212;
const WM_GETTITLEBARINFOEX = 0x033F;
const WM_MENUCOMMAND = 0x0126;
const WM_MENUDRAG = 0x0123;
const WM_MENUGETOBJECT = 0x0124;
const WM_MENURBUTTONUP = 0x0122;
const WM_NEXTMENU = 0x0213;
const WM_UNINITMENUPOPUP = 0x0125;

var winmsg = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MN_GETHMENU: MN_GETHMENU,
    WM_ERASEBKGND: WM_ERASEBKGND,
    WM_GETFONT: WM_GETFONT,
    WM_GETTEXT: WM_GETTEXT,
    WM_GETTEXTLENGTH: WM_GETTEXTLENGTH,
    WM_SETFONT: WM_SETFONT,
    WM_SETICON: WM_SETICON,
    WM_SETTEXT: WM_SETTEXT,
    WM_ACTIVATEAPP: WM_ACTIVATEAPP,
    WM_CANCELMODE: WM_CANCELMODE,
    WM_CHILDACTIVATE: WM_CHILDACTIVATE,
    WM_CLOSE: WM_CLOSE,
    WM_CREATE: WM_CREATE,
    WM_DESTROY: WM_DESTROY,
    WM_ENABLE: WM_ENABLE,
    WM_ENTERSIZEMOVE: WM_ENTERSIZEMOVE,
    WM_EXITSIZEMOVE: WM_EXITSIZEMOVE,
    WM_GETICON: WM_GETICON,
    WM_GETMINMAXINFO: WM_GETMINMAXINFO,
    WM_INPUTLANGCHANGE: WM_INPUTLANGCHANGE,
    WM_INPUTLANGCHANGEREQUEST: WM_INPUTLANGCHANGEREQUEST,
    WM_MOVE: WM_MOVE,
    WM_MOVING: WM_MOVING,
    WM_NCACTIVATE: WM_NCACTIVATE,
    WM_NCCALCSIZE: WM_NCCALCSIZE,
    WM_NCCREATE: WM_NCCREATE,
    WM_NCDESTROY: WM_NCDESTROY,
    WM_NULL: WM_NULL,
    WM_QUERYDRAGICON: WM_QUERYDRAGICON,
    WM_QUERYOPEN: WM_QUERYOPEN,
    WM_QUIT: WM_QUIT,
    WM_SHOWWINDOW: WM_SHOWWINDOW,
    WM_SIZE: WM_SIZE,
    WM_SIZING: WM_SIZING,
    WM_STYLECHANGED: WM_STYLECHANGED,
    WM_STYLECHANGING: WM_STYLECHANGING,
    WM_THEMECHANGED: WM_THEMECHANGED,
    WM_USERCHANGED: WM_USERCHANGED,
    WM_WINDOWPOSCHANGED: WM_WINDOWPOSCHANGED,
    WM_WINDOWPOSCHANGING: WM_WINDOWPOSCHANGING,
    WM_COPYDATA: WM_COPYDATA,
    WM_COMMAND: WM_COMMAND,
    WM_CONTEXTMENU: WM_CONTEXTMENU,
    WM_ENTERMENULOOP: WM_ENTERMENULOOP,
    WM_EXITMENULOOP: WM_EXITMENULOOP,
    WM_GETTITLEBARINFOEX: WM_GETTITLEBARINFOEX,
    WM_MENUCOMMAND: WM_MENUCOMMAND,
    WM_MENUDRAG: WM_MENUDRAG,
    WM_MENUGETOBJECT: WM_MENUGETOBJECT,
    WM_MENURBUTTONUP: WM_MENURBUTTONUP,
    WM_NEXTMENU: WM_NEXTMENU,
    WM_UNINITMENUPOPUP: WM_UNINITMENUPOPUP
});

Object.defineProperty(exports, 'Config', {
    enumerable: true,
    get: function () { return win32Def.Config; }
});
Object.defineProperty(exports, 'DModel', {
    enumerable: true,
    get: function () { return win32Def.DModel; }
});
Object.defineProperty(exports, 'DStruct', {
    enumerable: true,
    get: function () { return win32Def.DStruct; }
});
Object.defineProperty(exports, 'DTypes', {
    enumerable: true,
    get: function () { return win32Def.DTypes; }
});
Object.defineProperty(exports, 'FModel', {
    enumerable: true,
    get: function () { return win32Def.FModel; }
});
exports.BufferTypeFactory = BufferTypeFactory;
exports.C = index$3;
exports.CS = winmsg;
exports.Comctl32 = index$3;
exports.Constants = winmsg;
exports.DStructExt = index$4;
exports.K = index$2;
exports.Kernel32 = index$2;
exports.Ntdll = index$1;
exports.U = index;
exports.User32 = index;
//# sourceMappingURL=index.cjs.js.map
