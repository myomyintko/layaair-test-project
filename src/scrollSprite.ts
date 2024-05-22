const { regClass, property } = Laya;

@regClass()
export class ScrollableSprite extends Laya.Sprite {
    private content: Laya.Sprite;
    private scrollBar: Laya.ScrollBar;

    constructor(width: number, height: number) {
        super();
        this.size(width, height);

        // Create content sprite
        this.content = new Laya.Sprite();
        this.addChild(this.content);

        // Add content to the sprite (e.g., text, images, other sprites)
        // Example:
        const contentText: Laya.Text = new Laya.Text();
        contentText.text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit...";
        this.content.addChild(contentText);

        // Create scrollbar
        this.scrollBar = new Laya.ScrollBar();
        this.scrollBar.skin = "res/ui/scrollBar.png"; // Set the skin image
        this.scrollBar.size(20, this.height); // Set the size
        this.scrollBar.pos(this.width - this.scrollBar.width, 0); // Set position
        this.scrollBar.scrollSize = 50; // Set the scroll size
        this.scrollBar.changeHandler = new Laya.Handler(this, this.onScrollBarChange); // Set change handler
        this.addChild(this.scrollBar);

        // Update scrollbar properties based on content size
        this.updateScrollBar();

        // Enable mouse wheel scrolling
        this.on(Laya.Event.MOUSE_WHEEL, this, this.onMouseWheel);
    }

    private onMouseWheel(event: Laya.Event): void {
        // Adjust content position based on mouse wheel delta
        this.content.y += event.delta;
        
        // Update scrollbar thumb position
        this.scrollBar.value = -this.content.y;
    }

    private onScrollBarChange(value: number): void {
        // Update content position based on scrollbar value
        this.content.y = -value;
    }

    private updateScrollBar(): void {
        // Set scrollbar properties based on content size
        this.scrollBar.max = this.content.height - this.height;
        this.scrollBar.thumbPercent = this.height / this.content.height;
    }
}