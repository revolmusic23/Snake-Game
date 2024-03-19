new Vue({
  el: '#app',
  data: {
    snake: [[8, 4], [8, 3], [8, 2]],
    food: [8, 11],
    currentDirection: 'RIGHT',
    keyToDirection: {
      ArrowUp: 'UP',
      ArrowDown: 'DOWN',
      ArrowLeft: 'LEFT',
      ArrowRight: 'RIGHT',
    },
    gameSpeed: 400,
    isPaused: false,
    isGameActive: false,
    gameOver: false,
    score: 0,
  },

  created() {
    window.addEventListener('keydown', this.handleKeydown);
    this.moveInterval = setInterval(this.moveSnake, this.gameSpeed);
  },
  
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    clearInterval(this.moveInterval);
  },

  methods: {
    handleKeydown(event) {
      if (event.key === ' ') {
        this.togglePause();
      } 
      else if (event.key in this.keyToDirection) {
        this.changeDirection(event);
      }
      else if (event.key === 'Enter' && !this.isGameActive) {
        this.startGame();
      }
    },
    startGame() {
      this.isGameActive = true;
      this.gameOver = false;
      this.snake = [[8, 4], [8, 3], [8, 2]];
      this.food = [8, 11];
      this.currentDirection = 'RIGHT';
      this.score = 0;
      this.moveInterval = setInterval(this.moveSnake, this.gameSpeed);
    },
    endGame() {
      this.gameOver = true;
      this.isGameActive = false;
      clearInterval(this.moveInterval);
    },
    togglePause() {
      if (!this.isGameActive) return;
      this.isPaused = !this.isPaused;
      if (this.isPaused) {
        clearInterval(this.moveInterval);
      } 
      else {
        this.moveInterval = setInterval(this.moveSnake, this.gameSpeed);
      }
    },
    changeDirection(event) {
      const keyToDirection = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
      };
      const newDirection = keyToDirection[event.key];
      const oppositeDirection = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT',
      };
      if (newDirection && this.currentDirection !== oppositeDirection[newDirection]) {
        this.currentDirection = newDirection;
      }
    },
    setDirection(direction) {
      const oppositeDirection = {
        'UP': 'DOWN',
        'DOWN': 'UP',
        'LEFT': 'RIGHT',
        'RIGHT': 'LEFT',
      };
  
      if (this.currentDirection !== oppositeDirection[direction]) {
        this.currentDirection = direction;
      }
    },
    moveSnake() {
      if (!this.isGameActive || this.isPaused) return;
      let newHead = [...this.snake[0]];

      switch (this.currentDirection) {
        case 'UP': newHead[0] -= 1; break;
        case 'DOWN': newHead[0] += 1; break;
        case 'LEFT': newHead[1] -= 1; break;
        case 'RIGHT': newHead[1] += 1; break;
      }

      if (this.isColliding(newHead)) {
        this.endGame();
        return;
      }

      this.snake.unshift(newHead);

      if (this.isEatingFood(newHead)) {
        this.score++;
        this.generateFood();
      }
      else if ( this.currentDirection != null ) {
        this.snake.pop();
      }

    },
    isColliding(head) {
      const isCollidingWall = head[0] < 0 || head[0] >= 15 || head[1] < 0 || head[1] >= 15;
      if (isCollidingWall) return true;

      return this.snake.some((segment, index) => {
        if (index === 0) return false;
        return segment[0] === head[0] && segment[1] === head[1];
      });
    },
    isEatingFood(head) {
      return this.food[0] === head[0] && this.food[1] === head[1];
    },
    generateFood() {
      let newFood;
      do {
        newFood = [
          Math.floor(Math.random() * 15),
          Math.floor(Math.random() * 15),
        ];
      } while (this.isFoodOnSnake(newFood));

      this.food = newFood;
    },
    isFoodOnSnake(food) {
      return this.snake.some(segment => segment[0] === food[0] && segment[1] === food[1]);
    },
    getSegmentStyle(segment) {
      const size = this.segmentSize;
      const unit = size.includes('vw') ? 'vw' : 'px';
      const factor = size.includes('vw') ? (90 / 15) : 40;
  
      return {
        top: (segment[0] * factor) + unit,
        left: (segment[1] * factor) + unit
      };
    },
    getFoodStyle() {
      const size = this.segmentSize;
      const unit = size.includes('vw') ? 'vw' : 'px';
      const factor = size.includes('vw') ? (90 / 15) : 40;
  
      return {
        top: (this.food[0] * factor) + unit,
        left: (this.food[1] * factor) + unit,
        width: size,
        height: size
      };
    },
  },
  computed: {
    segmentSize() {
      return window.innerWidth <= 600 ? (90 / 15) + 'vw' : '40px';
    }
  },
});
