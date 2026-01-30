import {useCallback, useRef, useState} from 'react';

export const useFabMenus = (count: number) => {
    const fabRefs: any = useRef([]);
    const [activeMenuIndex, setActiveMenuIndex] = useState<any>(null);
    const [menuStates, setMenuStates] = useState(
        Array(count).fill(false)
    );

    // Set FAB ref
    const setFabRef = useCallback((index: any) => (ref: any) => {
        fabRefs.current[index] = ref;
    }, []);

    // Open a specific menu and close others
    const openMenu = useCallback((index: number) => {
        const newMenuStates = Array(count).fill(false);
        newMenuStates[index] = true;

        setMenuStates(newMenuStates);
        setActiveMenuIndex(index);

        return newMenuStates;
    }, [count]);

    // Close a specific menu
    const closeMenu = useCallback((index: number) => {
        setMenuStates(prev => {
            const newStates = [...prev];
            newStates[index] = false;
            return newStates;
        });

        if (activeMenuIndex === index) {
            setActiveMenuIndex(null);
        }
    }, [activeMenuIndex]);

    // Close all menus
    const closeAllMenus = useCallback(() => {
        setMenuStates(Array(count).fill(false));
        setActiveMenuIndex(null);
    }, [count]);

    // Toggle a menu (open if closed, close if open)
    const toggleMenu = useCallback((index: number) => {
        if (menuStates[index]) {
            closeMenu(index);
        } else {
            openMenu(index);
        }
    }, [menuStates, openMenu, closeMenu]);

    // Check if any menu is open
    const isAnyMenuOpen = menuStates.some(state => state);

    return {
        fabRefs,
        menuStates,
        activeMenuIndex,
        setFabRef,
        openMenu,
        closeMenu,
        closeAllMenus,
        toggleMenu,
        isAnyMenuOpen,
    };
};
