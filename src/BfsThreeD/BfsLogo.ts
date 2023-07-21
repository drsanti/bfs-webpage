import { BfsCanvas } from "./BfsCanvas";


export class BfsLogo extends BfsCanvas {

    private arms: LogoArm[] = [];

    constructor(container: HTMLElement | null) {
        super(container);

        this.arms.push(new LogoArm(this, 3, -Math.PI / 4));
        this.arms.push(new LogoArm(this, 2.5, Math.PI / 2));
        this.arms.push(new LogoArm(this, 2, Math.PI));

        this.addUpdateCallback(this.update);
    }

    private rAlpha = 0;
    private drawCore = () => {
        this.selectLayer("front");
        const ctx = this.getContext();

        const cX = this.cX();
        const cY = this.cY();
        ctx.save();
        ctx.translate(cX, cY);
        ctx.lineWidth = this.gY() / 6 + Math.sin(this.rAlpha);
        ctx.fillStyle = "#ffff";
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.arc(0, 0, this.getHeight() / 14 + Math.sin(this.rAlpha += 0.05) * 1, 0, Math.PI * 2);
        ctx.stroke();
        // ctx.fill();
        ctx.restore();
    }

    private drawArms = () => {
        this.selectLayer("front");
        // this.fill("rgba(0,0,0,0.1)");
        this.clear();
        this.arms.forEach(arm => {
            arm.update();
        });
    }

    public update = () => {

        this.drawArms();
        this.drawCore();
    }
}


class LogoArm {

    private maxLength = 0;
    private minLength = 0;
    private armLength = 0;
    private angleRad = 0;
    private alpha = 0;

    constructor(private canvas: BfsCanvas, armLength: number, angleRad: number) {
        this.maxLength = canvas.getHeight() / 3;
        this.minLength = this.maxLength / 2;

        this.armLength = armLength * this.maxLength;
        this.angleRad = angleRad;
        this.alpha = angleRad;
    }

    public update() {
        const ctx = this.canvas.selectLayer("front").getContext();
        const cX = this.canvas.cX();
        const cY = this.canvas.cY();
        // 
        ctx.save();
        ctx.translate(cX, cY);
        const a = this.angleRad + this.alpha * 0.1;
        ctx.rotate(a);

        // Circle (head)
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5 + this.armLength * 0.05;
        ctx.translate(0, -this.armLength);
        ctx.beginPath();
        ctx.arc(0, 0, this.armLength * 0.25, 0, Math.PI * 2);
        ctx.stroke();
        // ctx.fill();

        // Arm
        ctx.beginPath();
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 0.9;
        const dx = this.armLength * 0.07;
        ctx.moveTo(0, 0);
        ctx.lineTo(dx, dx);
        ctx.lineTo(0, this.armLength * 1);
        ctx.lineTo(-dx, dx);
        ctx.closePath();
        ctx.fill();
        // ctx.stroke();

        //
        ctx.restore();

        //
        const factor = (Math.sin(this.alpha) + 1) * 0.5;
        this.armLength = this.minLength + (this.maxLength - this.minLength) * factor;
        this.alpha += Math.PI / 87;
    }
}

