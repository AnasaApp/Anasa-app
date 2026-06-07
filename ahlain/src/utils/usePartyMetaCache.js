import {useEffect, useState} from 'react';
import {
  getPartyMetaCacheVersion,
  subscribePartyMetaCache,
} from './partyHelpers';

/** Re-render when local party occasion meta cache is hydrated or updated. */
const usePartyMetaCache = () => {
  const [version, setVersion] = useState(getPartyMetaCacheVersion());

  useEffect(() => subscribePartyMetaCache(setVersion), []);

  return version;
};

export default usePartyMetaCache;
