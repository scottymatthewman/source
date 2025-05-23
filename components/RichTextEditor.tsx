"use dom"

export default function DOMComponent({ className }: { className: string }) {
    return (
        <div>
            <p className={className}> Proof of concept </p>
        </div>
    )
}