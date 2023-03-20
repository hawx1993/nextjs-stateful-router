import { useRouter as nextUseRouter } from 'next/router';
import resso from 'resso';

type Route = string | { pathname: string; state?: object; query?: object };

interface Store<T> {
  state: T;
  [key: string]: any;
}

const store = resso<Store<any>>({
  state: {},
});
export const useRouter = () => {
  const router = nextUseRouter();
  const { query } = router;
  const buildUrl = (route: Route): string => {
    if (typeof route === 'string') {
      return `/${query.locale}${route}`;
    } else {
      const { pathname, query: params, state: routeState } = route;
      let url = `/${query.locale}${pathname}`;
      if (routeState) {
        store.state = routeState;
      }
      return url;
    }
  };

  const push = (route: Route, as?: string, options?: any) => {
    return router.push(buildUrl(route), as, options);
  };

  const replace = (route: Route, as?: string, options?: any) => {
    return router.replace(buildUrl(route), as, options);
  };

  return {
    ...router,
    push,
    replace,
    state: store.state,
  };
};
