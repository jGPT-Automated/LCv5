import { createContext, useCallback, useContext, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Renders sheets above everything, including the tab bar. A screen calls
 * `useOverlay(node)` and the node is drawn by the host at the app root.
 */
type Api = { set: (id: string, node: ReactNode | null) => void };

const OverlayApi = createContext<Api | null>(null);

export function OverlayHost({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Record<string, ReactNode>>({});
  const set = useCallback((id: string, node: ReactNode | null) => {
    setNodes((x) => {
      if (node === null) {
        if (!(id in x)) return x;
        const { [id]: _gone, ...rest } = x;
        return rest;
      }
      return { ...x, [id]: node };
    });
  }, []);
  const api = useMemo(() => ({ set }), [set]);
  return (
    <OverlayApi.Provider value={api}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {Object.entries(nodes).map(([id, node]) => (
          <View key={id} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {node}
          </View>
        ))}
      </View>
    </OverlayApi.Provider>
  );
}

/** Draw `node` in the root overlay while the calling component is mounted. */
export function useOverlay(node: ReactNode) {
  const api = useContext(OverlayApi);
  const id = useId();
  useEffect(() => {
    api?.set(id, node);
  });
  useEffect(() => () => api?.set(id, null), [api, id]);
}
