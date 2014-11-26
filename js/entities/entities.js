var playerData = {};

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
            playerData.orientation = 'northWest';
        }
        else if (me.input.isKeyPressed('left') && me.input.isKeyPressed('down')) {
            this.renderable.angle = Math.PI * -0.75;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            playerData.orientation = 'southWest';
        }
        else if (me.input.isKeyPressed('right') && me.input.isKeyPressed('up')) {
            this.renderable.angle = Math.PI * 0.25;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            playerData.orientation = 'northEast';
        }
        else if (me.input.isKeyPressed('right') && me.input.isKeyPressed('down')) {
            this.renderable.angle = Math.PI * -1.25;
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            playerData.orientation = 'southEast';
        }
        else if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            // this.renderable.flipX(true);
            // update the entity velocity
            this.renderable.angle = Math.PI * -0.5;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.body.vel.y = 0;
            playerData.orientation = 'west';
            // change to the walking animation
            // if (!this.renderable.isCurrentAnimation("walk")) {
            //     this.renderable.setCurrentAnimation("walk");
            // }
        } else if (me.input.isKeyPressed('right')) {
            // console.log(this.renderable)
            this.renderable.angle = Math.PI * 0.5;
            this.body.vel.y = 0;
            // unflip the sprite
            // this.renderable.flipX(true);
            // this.renderable.flipY(true);
            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            playerData.orientation = 'east';
        }
        else if (me.input.isKeyPressed('up')) {
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            this.body.vel.x = 0;
            this.renderable.angle = 0;
            playerData.orientation = 'north';
        }
        else if (me.input.isKeyPressed('down')) {
            this.body.vel.y += this.body.accel.y * me.timer.tick;
            this.body.vel.x = 0;
            this.renderable.angle = Math.PI;
            playerData.orientation = 'south';
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
        var lazerCords = this.calcLaserOrientation(x, y, playerData.orientation);
        this._super(me.Renderable, "init", [lazerCords.x, lazerCords.y, game.Laser.width, game.Laser.height]);
        this.z = 5;
        var body = this.calcLaserShape();
        this.body = body;

        // this.body = new me.Body(this, ([
        //     new me.Polygon(0, 0, [
        //         new me.Vector2d(0, 0),
        //         new me.Vector2d(this.width, 0),
        //         new me.Vector2d(this.width, this.height),
        //         new me.Vector2d(0, this.height)
        //     ])
        // ]));
        console.log('this.body', this.body.entity)
        console.log('this.body', this.body.entity.body.shapes[0].points)
        this.body.updateBounds();
        this.body.setVelocity(0, 20);
    },

    calcLaserOrientation: function(x, y, playerOrientation) {
      if(playerOrientation === 'south') {
        return {x: x, y: y + 110};
      }
      if(playerOrientation === 'north') {
        return {x: x, y: y - 10};
      }
      if(playerOrientation === 'west') {
        console.log('getting here')
        return {x: x - 60, y: y + 40};
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
      if(playerOrientation === 'north') {
        this.body.setVelocity(0, 20);
        var updatedVelX = 0;
        var updatedVelY = vely - (accelY * tick);
        return {velx: updatedVelX, vely: updatedVelY};
      }
      if(playerOrientation === 'west') {
        this.body.setVelocity(20, 0);
        var updatedVelX = velx - (accelX * tick);
        var updatedVelY = 0;
        console.log('updatedVelY', updatedVelY)
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
        var deltas = this.calcLaserDirectionDelta(this.body.vel.x, this.body.vel.y, this.body.accel.x, this.body.accel.y, playerData.orientation, me.timer.tick);
        // this.body.vel.y += this.body.accel.y * me.timer.tick;
        this.body.vel.y = deltas.vely;
        this.body.vel.x = deltas.velx;
        // console.log('this.body.vel.y', this.body.vel.y);
        // this.body.vel.x -= this.body.accel.y * me.timer.tick;

        if (this.pos.y + this.height <= 0) {
            me.game.world.removeChild(this);
        }

        this.body.update();

        return true;
    },
    onCollision: function(response, other) {
        if(response.a.name === 'mainplayer') {
            // console.log('response', response)
            // console.log('other', other)
            return false;
        }
        return true;
    }
});

game.Laser.width = 5;
game.Laser.height = 28;