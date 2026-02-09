<FAB.Group
    // fabStyle={{backgroundColor:'pink',width:40,height:40}}
    open={open}
    visible

    icon={open ? 'close' : 'plus'}
    style={styles.fabGroupCustom}
    onStateChange={() => {
    }}
    onPress={(e) => {
        console.log("open10", open);
        setOpen(prev => !prev);

    }}
    actions={[
        {
            size: 'medium',
            icon: 'share',
            label: 'Share',
            onPress: () => {
                console.log('Share', props.itemIndex);
                onFabPress()
            },
        },
        {
            icon: 'plus',
            label: 'New',
            onPress: () => {
                console.log('New', props.itemIndex);
                onFabPress()
            },
        },
        {
            icon: 'delete',
            label: 'Delete',
            onPress: () => {
                console.log('Delete', props.itemIndex);
                onFabPress();
            },
        },
    ]}
/>