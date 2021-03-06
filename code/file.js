import localforage from 'localforage'
import Encrypt from './encrypt'
import cuid from 'cuid'

import * as settings from './settings'

class File {

    init() {
        return new Promise(resolve => {
            localforage.config({ name: settings.name, storeName: settings.name })
            if (settings.clearStorage) {
                localforage.clear()
                this.erase()
                resolve()
            } else {
                localforage.getItem('data', (err, saved) => {
                    if (saved) {
                        try {
                            this.data = JSON.parse(Encrypt.decrypt(saved, settings.encrypt))
                            if (this.data.version !== settings.storageVersion) {
                                this.upgradeStorage()
                            }
                            resolve()
                        } catch (e) {
                            console.warn('erasing storage because of error in file...', e)
                            this.erase()
                            resolve()
                        }
                    } else {
                        this.erase()
                        resolve()
                    }
                })
            }
        })
    }

    async erase() {
        this.data = {
            version: settings.storageVersion,
            sound: 1,
            user: cuid(),
            shoot: {
                level: 0,
                max: 0,
            },
            noStory: false,
        }
        await this.save()
    }

    get shoot() {
        return this.data.shoot
    }

    get shootLevel() {
        return this.data.shoot.level
    }
    set shootLevel(value) {
        if (value !== this.data.shoot.level) {
            this.data.shoot.level = value
            this.data.shoot.max = Math.max(this.data.shoot.level, this.data.shoot.max)
            this.save()
        }
    }

    get shootMax() {
        return this.data.shoot.max
    }

    get sound() {
        return this.data.sound
    }
    set sound(value) {
        this.data.sound = value
        this.save()
    }

    get noStory() {
        return this.data.noStory
    }
    set noStory(value) {
        this.data.noStory = value
        this.save()
    }

    async save() {
        return new Promise(resolve => {
            localforage.setItem('data', Encrypt.encrypt(JSON.stringify(this.data), settings.encrypt), resolve)
        })
    }

    upgradeStorage() {
        this.erase()
    }
}

export const file = new File()