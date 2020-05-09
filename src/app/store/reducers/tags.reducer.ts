import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SessionsTagsActions } from '../actions';
import { SessionTag } from '../models';

export interface State extends EntityState<SessionTag> {

}

export const adapter = createEntityAdapter<SessionTag>();

const initialState = adapter.getInitialState({
  ids: [],
  entities: {
  },
});

export const reducer = createReducer(
  initialState,
  on(SessionsTagsActions.loadTagsSuccess, (state, { tags }) => adapter.upsertMany(tags, state)),
  on(SessionsTagsActions.saveTag, (state, { tag }) => adapter.upsertOne(tag, state)),
  on(SessionsTagsActions.deleteTag, (state, { id }) => adapter.removeOne(id, state)),
);

// export function reducer(state: State | undefined, action: Action): State {
//   return createReducerFromClass<State>(new TagsReducer())(state, action);
// }
//
// const CLASS_REDUCER_KEY = Symbol('ClassReducerProperties')
//
// interface ClassReducerProperties<T> {
//   initialState: T;
//   reducers: Map<string, PropertyKey>;
// }
//
// type Constructor<T> = new(...args: any[]) => T;
// function isDecorated(ctor: Constructor<object>): boolean {
//   return Reflect.has(ctor, CLASS_REDUCER_KEY);
// }
//
// function ensureDecorated(ctor: Constructor<object>): void {
//   if (!isDecorated(ctor)) {
//     throw new Error('Reducer class is not decorated');
//   }
// }
//
// function decorate(ctor: Constructor<object>): void {
//   if (!isDecorated(ctor)) {
//     const value: ClassReducerProperties<unknown> = {
//       initialState: undefined,
//       reducers: new Map<string, PropertyKey>(),
//     };
//
//     Reflect.defineProperty(ctor, CLASS_REDUCER_KEY, {
//       enumerable: false,
//       configurable: false,
//       writable: false,
//       value,
//     });
//   }
// }
//
// function getDecoratedProperties<T>(ctor: Constructor<object>): ClassReducerProperties<T> {
//   ensureDecorated(ctor);
//
//   return (ctor as any)[CLASS_REDUCER_KEY];
// }
//
// function ClassReducer<T>(options: { initialState: T }): ClassDecorator {
//   return ctor => {
//     decorate(ctor as unknown as Constructor<object>);
//     getDecoratedProperties(ctor as unknown as Constructor<object>).initialState = options.initialState;
//   }
// }
//
// function Reducer(action: Action): MethodDecorator {
//   // declare type MethodDecorator = <T>(target: Object,
//   // propertyKey: string | symbol,
//   // descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
//   return (target, propertyKey, descriptor) => {
//     decorate(target.constructor as Constructor<object>);
//     getDecoratedProperties(target.constructor as Constructor<object>).reducers.set(action.type, propertyKey);
//   }
// }
//
// function createReducerFromClass<T>(instance: object): ActionReducer<T> {
//   const props = getDecoratedProperties<T>(instance.constructor as Constructor<object>);
//   return (state, action) => {
//     state = state ?? props.initialState;
//     const propertyKey = props.reducers.get(action.type);
//     if (propertyKey) {
//       return (instance as any)[propertyKey](state, action);
//     }
//
//     return state;
//   }
// }
//
// interface ClassReducer<T> {
//   readonly initialState: T;
// }
//
// @ClassReducer({
//   initialState,
// })
// class TagsReducer {
//
//   @Reducer(SessionsTagsActions.saveTag)
//   public onSaveTag(state: State, action: ReturnType<typeof SessionsTagsActions.saveTag>): State {
//     return adapter.upsertOne(action.tag, state);
//   }
//
//   @Reducer(SessionsTagsActions.deleteTag)
//   public onDeleteTag(state: State, action: ReturnType<typeof SessionsTagsActions.deleteTag>): State {
//     return adapter.removeOne(action.id, state);
//   }
//
// }
