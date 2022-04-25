class FamilyRoom {
    constructor() {
        this.selectedPoint = 0 // where the user starts out
        this.roomPoints = [
            {
                id: 0,
                name: "start",
                asset: "r_start_1",
                teleportPaths: [
                    { x: 300, y: 0, z: 5, to: "case" },
                    { x: 50, y: 0, z: -400, to: "window" },
                    { x: 250, y: 0, z: -260, to: "center" },
                ]
            },
            {
                id: 1,
                name: "center",
                asset: "r_center_1",
                teleportPaths: [
                    { x: -300, y: 0, z: -240, to: "shelf" },
                    { x: -250, y: 0, z: 180, to: "window" },
                    { x: 200, y: 0, z: 250, to: "start" },
                    { x: 240, y: 0, z: -180, to: "case" },
                ]
            },
            {
                id: 2,
                name: "case",
                asset: "r_case_1",
                teleportPaths: [
                    { x: 100, y: 0, z: -400, to: "start" },
                    { x: 260, y: 0, z: -80, to: "center" },
                ]
            },
            {
                id: 3,
                name: "shelf",
                asset: "r_shelf_1",
                teleportPaths: [
                    { x: 320, y: 0, z: 50, to: "window" },
                    { x: 220, y: 0, z: -350, to: "case" },
                ]
            },
            {
                id: 4,
                name: "window",
                asset: "r_window_1",
                teleportPaths: [
                    { x: -380, y: 0, z: 200, to: "shelf" },
                    { x: -50, y: 0, z: -380, to: "start" },
                ]

            },
        ]
        this.sky = new Sky({ asset: this.roomPoints[this.selectedPoint].asset })
        world.add(this.sky)
        this.allTeleportPaths = []
        this.updateTeleportPads()
    }
    changeValue(toName) {
        let foundNewRoomInfo = this.roomPoints.find(o => o.name === toName)
        this.selectedPoint = foundNewRoomInfo.id
        this.sky.setAsset(foundNewRoomInfo.asset)
        this.updateTeleportPads()
    }
    // Updates the pads being shown/hidden depending on current selection
    updateTeleportPads() {

        // Updates the object to find (its clickable region)
        if (!!story) {
            if (story.steps[story.currentStep].actions[story.currentSubStep]?.type === "discovery") {
                updateObjectMarker(this.roomPoints[this.selectedPoint].name)
            }
        }

        // Clear current
        this.allTeleportPaths.forEach(eachOldPoint => {
            world.remove(eachOldPoint.obj.clickEventObj)
            world.remove(eachOldPoint.obj.indicator)
        })
        this.allTeleportPaths = []

        // Set new
        const currentRoom = this.roomPoints[this.selectedPoint]
        currentRoom.teleportPaths.forEach(eachTeleportLocation => {
            this.allTeleportPaths.push({
                obj: new TeleportMarker({
                    x: eachTeleportLocation.x,
                    y: eachTeleportLocation.y,
                    z: eachTeleportLocation.z,
                    toLocationName: eachTeleportLocation.to
                }),
                id: currentRoom.id
            })
        })
    }
}