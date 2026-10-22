import { abortable, measureStage, requestSignal } from '../request-budget';

it('stops a task that never settles when its caller disconnects', async () => {
    const controller = new AbortController();
    const pending = abortable(new Promise(() => {}), requestSignal(controller.signal));
    controller.abort(new Error('Disconnected'));
    await expect(pending).rejects.toThrow('Disconnected');
});

it('enforces a deadline even if an SDK ignores cancellation', async () => {
    const pending = abortable(new Promise(() => {}), requestSignal(undefined, 20));
    await expect(pending).rejects.toMatchObject({ name: 'TimeoutError' });
});

it('does not start another stage after its budget has expired', async () => {
    const controller = new AbortController();
    controller.abort(new Error('Expired'));
    const run = jest.fn();
    await expect(measureStage('generation', controller.signal, run)).rejects.toThrow('Expired');
    expect(run).not.toHaveBeenCalled();
});
