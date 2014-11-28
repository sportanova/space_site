var gameData = {orientation: 'north'};

game.PersonalDoc = me.Entity.extend({
  init: function(x, y, settings) {
        var settings = {width: gameData.doc.width, height: gameData.doc.height, x: x, y: y, image: gameData.doc.image}

        this._super(me.Entity, 'init', [x, y, settings]);
        this.image = me.loader.getImage(gameData.doc.image);
        this.docLink = gameData.doc.link;

        me.input.registerPointerEvent('pointerdown', this, this.onMouseDown.bind(this));
    },
    onMouseDown: function() {
      window.open(this.docLink)
    }
});

game.AsteroidEntity = me.Entity.extend({
  init: function(x, y, settings) {
    console.log('asteroid settings', settings)
        settings['height'] = 128;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.hitPoints = 3;
        this.x = x;
        this.y = y;
        this.settings = settings;
    },
    removeHitPoint: function() {
      this.hitPoints -= 1;
      if (this.hitPoints === 0) {
        me.game.world.removeChild(this);

        var image = me.loader.getImage('explosion');
        var emitter = new me.ParticleEmitter(this.x + (this.width / 2), this.y + (this.height / 2), {
            image: image,
            width: 10,
            totalParticles: 100,
            angle: 0,
            angleVariation: 16.283185307179586,
            maxLife: 3000
        });
        emitter.z = 11;
        me.game.world.addChild(emitter);
        me.game.world.addChild(emitter.container);
        emitter.burstParticles();

        gameData.doc = {
          image: this.settings.docImage,
          width: this.settings.docWidth,
          height: this.settings.docHeight,
          link: this.settings.docLink
        };

        var that = this;
        setTimeout(function() {
            me.game.world.addChild(me.pool.pull("doc", that.x, that.y))
        }, 1000)

        setTimeout(function() {
            me.game.world.removeChild(emitter);
            me.game.world.removeChild(emitter.container);
        }, 3000)
      }
    },
    update: function(dt) {
        // apply physics to the body (this moves the entity)
        this.body.update(dt);
 
        // handle collisions against other shapes
        me.collision.check(this);
 
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
     
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        if(response.a.name === 'mainplayer') {
            return false;
        }
        else if(response.a.name === 'mainplayer') {
            return false;
        }
        else {
            return false;
        }
    }
})

game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        settings['height'] = 75;
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
 
        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(3, 3);
 
        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
 
        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;
         
        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0]);
    },
 
    /* -----
 
    update the player pos
 
    ------ */
    update: function(dt) {
        if (me.input.isKeyPressed('left') && me.input.isKeyPressed('up')) {
            this.renderable.angle = Math.PI * 1.75;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            gameData.orientation = 'northWest';
        }
        else if (me.input.isKeyPressed('left') && me.input.isKeyPressed('down')) {
            this.renderable.angle = Math.PI * -0.75;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            gameData.orientation = 'southWest';
        }
        else if (me.input.isKeyPressed('right') && me.input.isKeyPressed('up')) {
            this.renderable.angle = Math.PI * 0.25;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            gameData.orientation = 'northEast';
        }
        else if (me.input.isKeyPressed('right') && me.input.isKeyPressed('down')) {
            this.renderable.angle = Math.PI * -1.25;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            gameData.orientation = 'southEast';
        }
        else if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            // this.renderable.flipX(true);
            // update the entity velocity
            this.renderable.angle = Math.PI * -0.5;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.body.vel.y = 0;
            gameData.orientation = 'west';
            // change to the walking animation
            // if (!this.renderable.isCurrentAnimation("walk")) {
            //     this.renderable.setCurrentAnimation("walk");
            // }
        } else if (me.input.isKeyPressed('right')) {
            this.renderable.angle = Math.PI * 0.5;
            this.body.vel.y = 0;
            // unflip the sprite
            // this.renderable.flipX(true);
            // this.renderable.flipY(true);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            gameData.orientation = 'east';
        }
        else if (me.input.isKeyPressed('up')) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.vel.x = 0;
            this.renderable.angle = 0;
            gameData.orientation = 'north';
        }
        else if (me.input.isKeyPressed('down')) {
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x = 0;
            this.renderable.angle = Math.PI;
            gameData.orientation = 'south';
        }
        else {
            // this.body.vel.x = 0;
            this.body.vel.y = 0;
            this.body.vel.x = 0;
            this.renderable.setCurrentAnimation("walk");
        }

        if (me.input.isKeyPressed("shoot")) {
            me.game.world.addChild(me.pool.pull("laser", this.pos.x + (this.width / 2 - game.Laser.width / 2), this.pos.y - game.Laser.height))
        }
     
        // if (me.input.isKeyPressed('jump')) {
        //     // make sure we are not already jumping or falling
        //     if (!this.body.jumping && !this.body.falling) {
        //         // set current vel to the maximum defined value
        //         // gravity will then do the rest
        //         this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        //         // set the jumping flag
        //         this.body.jumping = true;
        //     }
 
        // }
 
        // apply physics to the body (this moves the entity)
        this.body.update(dt);
 
        // handle collisions against other shapes
        me.collision.check(this);
 
        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
     
    /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});

game.Laser = me.Renderable.extend({
    init: function (x, y) {
        var lazerCords = this.calcLaserPosition(x, y, gameData.orientation);
        this._super(me.Renderable, "init", [lazerCords.x, lazerCords.y, game.Laser.width, game.Laser.height]);
        this.z = 5;
        this.name = 'laser'
        var body = this.calcLaserShape();
        this.body = body;
        this.body.updateBounds();
        this.body.setVelocity(0, 20);
    },

    calcLaserPosition: function(x, y, playerOrientation) {
      if(playerOrientation === 'south') {
        return {x: x, y: y + 90};
      }
      if(playerOrientation === 'north') {
        return {x: x, y: y - 5};
      }
      if(playerOrientation === 'west') {
        return {x: x - 70, y: y + 42};
      }
      if(playerOrientation === 'east') {
        return {x: x + 50, y: y + 40};
      }
      if(playerOrientation === 'northWest') {
        return {x: x - 45, y: y + 15};
      }
      if(playerOrientation === 'northEast') {
        return {x: x + 45, y: y + 15};
      }
      if(playerOrientation === 'southEast') {
        return {x: x + 45, y: y + 65};
      }
      if(playerOrientation === 'southWest') {
        return {x: x - 45, y: y + 65};
      }
      else {
        return {x: x, y: y}
      }
    },
    calcLaserShape: function() {
      return new me.Body(this, ([
            new me.Polygon(0, 0, [
                new me.Vector2d(-this.height, 0),
                new me.Vector2d(this.height, 0),
                new me.Vector2d(-this.height, this.width),
                new me.Vector2d(this.height, this.width)
            ])
        ]));
    },
    calcLaserDirectionDelta: function(velx, vely, accelX, accelY, playerOrientation, tick) {
      if(playerOrientation === 'south') {
        this.body.setVelocity(0, 20);
        var updatedVelX = 0;
        var updatedVelY = vely + (accelY * tick);
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'north') {
        this.body.setVelocity(0, 20);
        var updatedVelX = 0;
        var updatedVelY = vely - (accelY * tick);
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'west') {
        this.body.setVelocity(20, 0);
        var updatedVelX = velx - (accelX * tick);
        var updatedVelY = 0;
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'east') {
        this.body.setVelocity(20, 0);
        var updatedVelX = velx + (accelX * tick);
        var updatedVelY = 0;
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'northWest') {
        this.body.setVelocity(20, 20);
        var updatedVelX = velx - (accelX * tick);
        var updatedVelY = vely - (accelY * tick);;
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'northEast') {
        this.body.setVelocity(20, 20);
        var updatedVelX = velx + (accelX * tick);
        var updatedVelY = vely - (accelY * tick);;
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'southEast') {
        this.body.setVelocity(20, 20);
        var updatedVelX = velx + (accelX * tick);
        var updatedVelY = vely + (accelY * tick);;
        return {velx: updatedVelX, vely: updatedVelY};
      }
      else if(playerOrientation === 'southWest') {
        this.body.setVelocity(20, 20);
        var updatedVelX = velx - (accelX * tick);
        var updatedVelY = vely + (accelY * tick);;
        return {velx: updatedVelX, vely: updatedVelY};
      }
    },

    draw: function (renderer) {
        var color = renderer.getColor();
        renderer.setColor('#5EFF7E');
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        renderer.setColor(color);
    },

    update: function (time) {
        this._super(me.Renderable, "update", [time]);
        var deltas = this.calcLaserDirectionDelta(this.body.vel.x, this.body.vel.y, this.body.accel.x, this.body.accel.y, gameData.orientation, me.timer.tick);
        this.body.vel.y = deltas.vely;
        this.body.vel.x = deltas.velx;

        if (this.pos.y + this.height <= 0) {
            me.game.world.removeChild(this);
        }

        this.body.update();

        me.collision.check(this);

        return true;
    },
    onCollision: function(response, other) {
        if(response.b.name === 'mainplayer') {
            // return false;
        } else if(response.b.name === 'asteroid') {
            var asteroid = response.b;
            asteroid.removeHitPoint();
            me.game.world.removeChild(this);
        }

        return true;
    }
});

game.Laser.width = 5;
game.Laser.height = 5;