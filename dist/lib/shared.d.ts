import * as ref from 'ref-napi';
import * as _UnionDi from 'ref-union-di';
export declare const Union: {
    (fields?: Record<string, string | ref.Type> | undefined): _UnionDi.UnionType;
    new (fields?: Record<string, string | ref.Type> | undefined): _UnionDi.UnionType;
};
